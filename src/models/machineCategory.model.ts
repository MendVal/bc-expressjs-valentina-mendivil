import { Schema, model, Document } from 'mongoose';

export interface IMachineCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const machineCategorySchema = new Schema<IMachineCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true },
);

export const MachineCategory = model<IMachineCategory>(
  'MachineCategory',
  machineCategorySchema,
);