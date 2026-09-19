import mongoose from "mongoose";

const taskTemplateSchema = new mongoose.Schema({
  serviceTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceType", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: String,
  defaultDueDays: { type: Number, default: 7, min: 0 },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

taskTemplateSchema.index({ serviceTypeId: 1, order: 1 });
const TaskTemplate = mongoose.model("TaskTemplate", taskTemplateSchema);

export default TaskTemplate;