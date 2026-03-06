import mongoose, { Schema, Document } from "mongoose";

export interface ICalculation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  createdAt: Date;
}

const CalculationSchema = new Schema<ICalculation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    inputs: { type: Schema.Types.Mixed, required: true },
    results: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

CalculationSchema.index({ userId: 1, createdAt: -1 });

export const Calculation =
  mongoose.models.Calculation || mongoose.model<ICalculation>("Calculation", CalculationSchema);
