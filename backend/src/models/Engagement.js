import mongoose from "mongoose";

const engagementSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, index: true },
  serviceTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceType", required: true, index: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["recurring", "one_time"], required: true },
  period: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: Date,
  status: { type: String, enum: ["open", "completed", "cancelled"], default: "open" }
}, { timestamps: true });

engagementSchema.index({ clientId: 1, serviceTypeId: 1, period: 1 }, { unique: true });
const Engagement = mongoose.model("Engagement", engagementSchema);

export default Engagement;