import AuditLog from "../models/AuditLog.js";
export async function audit(actor, action, entity, entityId, details = {}) {
  if (!actor) return;
  try { await AuditLog.create({ actor, action, entity, entityId, details }); } catch (error) { console.error("Audit log failed:", error.message); }
}
