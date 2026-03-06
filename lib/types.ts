export interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlySpending: number;
  expectedReturn: number; // annual percentage
  inflationRate: number; // annual percentage
}

export interface YearlySnapshot {
  age: number;
  year: number;
  balance: number;
}

export interface ScenarioResult {
  label: string;
  depletionAge: number | null; // null means savings last beyond life expectancy
  finalBalance: number;
  snapshots: YearlySnapshot[];
}

export interface ImprovementScenario {
  title: string;
  description: string;
  depletionAge: number | null;
  yearsGained: number;
  modifiedInputs: Partial<CalculatorInputs>;
}

export interface CalculationResults {
  inputs: CalculatorInputs;
  typical: ScenarioResult;
  downside: ScenarioResult;
  upside: ScenarioResult;
  improvements: ImprovementScenario[];
  aiSuggestions?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}
