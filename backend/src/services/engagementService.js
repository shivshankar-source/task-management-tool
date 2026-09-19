import mongoose from "mongoose";
import Engagement from "../models/Engagement.js";
import TaskTemplate from "../models/TaskTemplate.js";
import Task from "../models/Task.js";
import ServiceType from "../models/ServiceType.js";

export async function createEngagementWithTasks(data, actorId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const service = await ServiceType.findById(data.serviceTypeId).session(session);
    if (!service) throw Object.assign(new Error("Service type not found"), { status: 404 });

    const start = new Date(data.startDate);
    const period = data.period || `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    const duplicate = await Engagement.findOne({ clientId: data.clientId, serviceTypeId: data.serviceTypeId, period }).session(session);
    if (duplicate) { await session.abortTransaction(); return { engagement: duplicate, taskCount: 0, created: false }; }

    const engagement = await Engagement.create([{
      ...data,
      managerId: data.managerId || actorId,
      type: service.engagementType
    }], { session });

    const templates = await TaskTemplate.find({
      serviceTypeId: service._id, isActive: true
    }).sort({ order: 1 }).session(session);

    const tasks = templates.map(t => ({
      engagementId: engagement[0]._id,
      templateId: t._id,
      title: t.title,
      description: t.description,
      createdBy: actorId,
      reviewerId: engagement[0].managerId,
      dueDate: new Date(start.getTime() + t.defaultDueDays * 86400000)
    }));
    if (tasks.length) await Task.insertMany(tasks, { session });
    await session.commitTransaction();
    return { engagement: engagement[0], taskCount: tasks.length, created: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}
export async function generateNextPeriodTasks(engagementId, actorId) {
  const source = await Engagement.findById(engagementId);
  if (!source) throw new Error("Engagement not found");
  const service = await ServiceType.findById(source.serviceTypeId);
  if (!service) throw new Error("Service type not found");
  const months = service.recurrence === "quarterly" ? 3 : service.recurrence === "yearly" ? 12 : 1;
  const startDate = new Date(source.startDate);
  startDate.setMonth(startDate.getMonth() + months);
  const period = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`;
  const existing = await Engagement.findOne({ clientId: source.clientId, serviceTypeId: source.serviceTypeId, period });
  if (existing) return { engagement: existing, created: false };
  const next = await createEngagementWithTasks({
    clientId: source.clientId,
    serviceTypeId: source.serviceTypeId,
    managerId: source.managerId,
    title: source.title,
    period,
    startDate,
    dueDate: source.dueDate ? new Date(new Date(source.dueDate).setMonth(new Date(source.dueDate).getMonth() + months)) : undefined,
    notes: source.notes
  }, actorId);
  return { engagement: next, created: true };
}
