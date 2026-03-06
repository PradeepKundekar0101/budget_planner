import type {
  CalculatorInputs,
  ScenarioResult,
  ImprovementScenario,
  YearlySnapshot,
  CalculationResults,
} from "./types";

function runProjection(
  inputs: CalculatorInputs,
  annualReturnOverride?: number
): { depletionAge: number | null; finalBalance: number; snapshots: YearlySnapshot[] } {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlySpending,
    inflationRate,
  } = inputs;

  const annualReturn = annualReturnOverride ?? inputs.expectedReturn;
  const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const monthlyInflation = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;

  // Accumulation phase: grow savings from current age to retirement age
  const yearsToRetirement = retirementAge - currentAge;
  let balance = currentSavings;
  const snapshots: YearlySnapshot[] = [];

  for (let month = 0; month < yearsToRetirement * 12; month++) {
    balance = balance * (1 + monthlyReturn);
    if (month % 12 === 11 || month === 0) {
      const age = currentAge + Math.floor(month / 12) + 1;
      if (month === 0) {
        snapshots.push({ age: currentAge, year: 0, balance: Math.round(currentSavings) });
      }
      if (month % 12 === 11) {
        snapshots.push({ age, year: age - currentAge, balance: Math.round(balance) });
      }
    }
  }

  if (snapshots.length === 0) {
    snapshots.push({ age: currentAge, year: 0, balance: Math.round(balance) });
  }

  const balanceAtRetirement = balance;
  let depletionAge: number | null = null;

  // Distribution phase: drawdown from retirement to life expectancy
  const yearsInRetirement = lifeExpectancy - retirementAge;
  for (let month = 0; month < yearsInRetirement * 12; month++) {
    const inflationMultiplier = Math.pow(1 + monthlyInflation, month);
    const adjustedSpending = monthlySpending * inflationMultiplier;
    balance = balance * (1 + monthlyReturn) - adjustedSpending;

    if (balance <= 0 && depletionAge === null) {
      depletionAge = retirementAge + Math.floor(month / 12);
      balance = 0;
    }

    if (month % 12 === 11) {
      const age = retirementAge + Math.floor(month / 12) + 1;
      snapshots.push({ age, year: age - currentAge, balance: Math.round(Math.max(0, balance)) });
    }
  }

  return {
    depletionAge,
    finalBalance: Math.round(Math.max(0, balance)),
    snapshots,
  };
}

function buildScenario(
  inputs: CalculatorInputs,
  label: string,
  returnOverride?: number
): ScenarioResult {
  const result = runProjection(inputs, returnOverride);
  return { label, ...result };
}

function buildImprovements(
  inputs: CalculatorInputs,
  baseDepletionAge: number | null
): ImprovementScenario[] {
  const baseAge = baseDepletionAge ?? inputs.lifeExpectancy;
  const improvements: ImprovementScenario[] = [];

  // 1. Reduce spending by 15%
  const reducedSpending = inputs.monthlySpending * 0.85;
  const spendingResult = runProjection({ ...inputs, monthlySpending: reducedSpending });
  const spendingDepAge = spendingResult.depletionAge ?? inputs.lifeExpectancy;
  improvements.push({
    title: "Reduce Monthly Spending by 15%",
    description: `Cut spending from $${inputs.monthlySpending.toLocaleString()} to $${Math.round(reducedSpending).toLocaleString()}/month`,
    depletionAge: spendingResult.depletionAge,
    yearsGained: spendingDepAge - baseAge,
    modifiedInputs: { monthlySpending: Math.round(reducedSpending) },
  });

  // 2. Delay retirement by 3 years
  const delayedRetirement = inputs.retirementAge + 3;
  if (delayedRetirement < inputs.lifeExpectancy) {
    const delayResult = runProjection({ ...inputs, retirementAge: delayedRetirement });
    const delayDepAge = delayResult.depletionAge ?? inputs.lifeExpectancy;
    improvements.push({
      title: "Delay Retirement by 3 Years",
      description: `Retire at ${delayedRetirement} instead of ${inputs.retirementAge}`,
      depletionAge: delayResult.depletionAge,
      yearsGained: delayDepAge - baseAge,
      modifiedInputs: { retirementAge: delayedRetirement },
    });
  }

  // 3. Increase returns by 1%
  const betterReturn = inputs.expectedReturn + 1;
  const returnResult = runProjection({ ...inputs }, betterReturn);
  const returnDepAge = returnResult.depletionAge ?? inputs.lifeExpectancy;
  improvements.push({
    title: "Increase Returns by 1%",
    description: `Achieve ${betterReturn}% annual return instead of ${inputs.expectedReturn}%`,
    depletionAge: returnResult.depletionAge,
    yearsGained: returnDepAge - baseAge,
    modifiedInputs: { expectedReturn: betterReturn },
  });

  // 4. Combined: reduce spending 10% + delay 2 years
  const comboSpending = inputs.monthlySpending * 0.9;
  const comboRetirement = inputs.retirementAge + 2;
  if (comboRetirement < inputs.lifeExpectancy) {
    const comboResult = runProjection({
      ...inputs,
      monthlySpending: comboSpending,
      retirementAge: comboRetirement,
    });
    const comboDepAge = comboResult.depletionAge ?? inputs.lifeExpectancy;
    improvements.push({
      title: "Combined: Spend Less + Delay Retirement",
      description: `Reduce spending by 10% and retire at ${comboRetirement}`,
      depletionAge: comboResult.depletionAge,
      yearsGained: comboDepAge - baseAge,
      modifiedInputs: {
        monthlySpending: Math.round(comboSpending),
        retirementAge: comboRetirement,
      },
    });
  }

  return improvements.sort((a, b) => b.yearsGained - a.yearsGained);
}

export function calculateRetirement(inputs: CalculatorInputs): CalculationResults {
  const typical = buildScenario(inputs, "Typical");
  const downside = buildScenario(inputs, "Downside (Return -2%)", inputs.expectedReturn - 2);
  const upside = buildScenario(inputs, "Upside (Return +2%)", inputs.expectedReturn + 2);
  const improvements = buildImprovements(inputs, typical.depletionAge);

  return { inputs, typical, downside, upside, improvements };
}
