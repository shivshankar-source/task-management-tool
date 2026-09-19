import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  from: String,
  to: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  engagementId: { type: mongoose.Schema.Types.ObjectId, ref: "Engagement", required: true, index: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskTemplate" },
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date, required: true, index: true },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "waiting_for_client", "ready_for_review", "changes_requested", "completed"],
    default: "not_started",
    index: true
  },
  submissionNote: String,
  history: [historySchema]
}, { timestamps: true });

taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
taskSchema.index({ engagementId: 1, templateId: 1 }, { unique: true, sparse: true });
const Task = mongoose.model("Task", taskSchema);

export default Task;