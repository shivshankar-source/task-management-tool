import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: String,
  engagementType: { type: String, enum: ["recurring", "one_time"], required: true },
  recurrence: { type: String, enum: ["monthly", "quarterly", "yearly", null], default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceType;