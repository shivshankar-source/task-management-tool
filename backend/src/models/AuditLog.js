import mongoose from "mongoose";
const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true });
const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
