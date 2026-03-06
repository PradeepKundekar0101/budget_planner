import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Calculation } from "@/lib/models/Calculation";
import { getCurrentUser } from "@/lib/auth";
import { calculateRetirement } from "@/lib/calculator";
import { getAISuggestions } from "@/lib/openrouter";
import type { CalculatorInputs } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const inputs: CalculatorInputs = await req.json();

    if (
      !inputs.currentAge ||
      !inputs.retirementAge ||
      !inputs.lifeExpectancy ||
      !inputs.currentSavings ||
      !inputs.monthlySpending ||
      inputs.expectedReturn === undefined ||
      inputs.inflationRate === undefined
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (inputs.currentAge >= inputs.retirementAge) {
      return NextResponse.json(
        { error: "Retirement age must be greater than current age" },
        { status: 400 }
      );
    }

    if (inputs.retirementAge >= inputs.lifeExpectancy) {
      return NextResponse.json(
        { error: "Life expectancy must be greater than retirement age" },
        { status: 400 }
      );
    }

    const results = calculateRetirement(inputs);

    // Fetch AI suggestions in the background - don't block the response
    const aiSuggestions = await getAISuggestions(inputs, results.typical, results.improvements);
    results.aiSuggestions = aiSuggestions;

    await connectDB();

    const calculation = await Calculation.create({
      userId: user.id,
      inputs,
      results,
    });

    return NextResponse.json({
      id: calculation._id.toString(),
      results,
    });
  } catch (error) {
    console.error("Calculator error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
