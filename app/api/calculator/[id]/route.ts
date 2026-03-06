import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Calculation } from "@/lib/models/Calculation";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const calculation = await Calculation.findOne({ _id: id, userId: user.id });
    if (!calculation) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: calculation._id.toString(),
      inputs: calculation.inputs,
      results: calculation.results,
      createdAt: calculation.createdAt,
    });
  } catch (error) {
    console.error("Get calculation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
