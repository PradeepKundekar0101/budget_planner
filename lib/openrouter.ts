import type { CalculatorInputs, ScenarioResult, ImprovementScenario } from "./types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function getAISuggestions(
  inputs: CalculatorInputs,
  typical: ScenarioResult,
  improvements: ImprovementScenario[]
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return "AI suggestions unavailable — no API key configured.";
  }

  const prompt = `You are a retirement planning advisor. Based on the following retirement calculation, provide 3-5 personalized, actionable suggestions to help this person improve their retirement outlook. Be concise and practical.

**User Profile:**
- Current Age: ${inputs.currentAge}
- Retirement Age: ${inputs.retirementAge}
- Life Expectancy: ${inputs.lifeExpectancy}
- Current Savings: $${inputs.currentSavings.toLocaleString()}
- Monthly Spending: $${inputs.monthlySpending.toLocaleString()}
- Expected Return: ${inputs.expectedReturn}%
- Inflation Rate: ${inputs.inflationRate}%

**Projection Result:**
- Savings ${typical.depletionAge ? `run out at age ${typical.depletionAge}` : `last until age ${inputs.lifeExpectancy} with $${typical.finalBalance.toLocaleString()} remaining`}

**Improvement Scenarios Already Shown:**
${improvements.map((imp) => `- ${imp.title}: ${imp.yearsGained > 0 ? `+${imp.yearsGained} years` : "no improvement"}`).join("\n")}

Provide additional creative and personalized strategies beyond the standard ones already shown. Format as a numbered list.`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      return "AI suggestions temporarily unavailable.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No suggestions generated.";
  } catch {
    return "AI suggestions temporarily unavailable.";
  }
}
