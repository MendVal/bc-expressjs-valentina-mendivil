import { Schema, model, Document, Types } from 'mongoose';

export interface IMachine extends Document {
  name: string;
  category: Types.ObjectId;
  tokenCost: number;
  status: 'available' | 'in_use' | 'maintenance';
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const machineSchema = new Schema<IMachine>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'MachineCategory',
      required: true,
    },
    tokenCost: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['available', 'in_use', 'maintenance'],
      default: 'available',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Machine = model<IMachine>('Machine', machineSchema);