import { Router } from "express";
import Task from "../models/Task.js";
import { protect, allow } from "../middleware/auth.js";
import { changeTaskStatus } from "../services/taskService.js";
import { audit } from "../services/auditService.js";
import User from "../models/User.js";
import Engagement from "../models/Engagement.js";
const router = Router();
router.use(protect);

router.post("/", allow("admin", "manager"), async (req, res) => {
  const { engagementId, title, description, assignedTo, dueDate } = req.body;
  if (!engagementId || !title || !dueDate) {
    return res.status(400).json({ message: "engagementId, title and dueDate are required" });
  }

  const engagement = await Engagement.findById(engagementId).select("managerId");
  if (!engagement) return res.status(404).json({ message: "Engagement not found" });

  if (req.user.role === "manager" && String(engagement.managerId) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can create tasks only for your engagements" });
  }

  let assignee = null;
  if (assignedTo) {
    assignee = await User.findOne({ _id: assignedTo, role: "team_member", isActive: true });
    if (!assignee) return res.status(400).json({ message: "assignedTo must be an active team member" });
  }

  const task = await Task.create({
    engagementId,
    title,
    description,
    assignedTo: assignee?._id,
    reviewerId: engagement.managerId,
    createdBy: req.user._id,
    dueDate,
    status: "not_started",
    history: []
  });

  await audit(req.user._id, "create", "Task", task._id, { engagementId, assignedTo: assignee?._id || null });
  res.status(201).json(await Task.findById(task._id).populate("assignedTo engagementId"));
});

router.get("/dashboard", async (req, res) => {
  let filter = {};
  if (req.user.role === "team_member") filter = { assignedTo: req.user._id };
  if (req.user.role === "manager") {
    const engagements = await Engagement.find({ managerId: req.user._id }).select("_id");
    filter = { engagementId: { $in: engagements.map(e => e._id) } };
  }
  const tasks = await Task.find(filter);
  const today = new Date(); today.setHours(23, 59, 59, 999);
  const start = new Date(); start.setHours(0, 0, 0, 0);
  res.json({
    open: tasks.filter(t => t.status !== "completed").length,
    overdue: tasks.filter(t => t.status !== "completed" && t.dueDate < start).length,
    dueToday: tasks.filter(t => t.status !== "completed" && t.dueDate >= start && t.dueDate <= today).length,
    waitingForClient: tasks.filter(t => t.status === "waiting_for_client").length,
    readyForReview: tasks.filter(t => t.status === "ready_for_review").length
  });
});

router.get("/", async (req, res) => {
  let filter = {};
  if (req.user.role === "team_member") filter = { assignedTo: req.user._id };
  if (req.user.role === "manager") {
    const engagements = await Engagement.find({ managerId: req.user._id }).select("_id");
    filter = { engagementId: { $in: engagements.map(e => e._id) } };
  }
  res.json(await Task.find(filter).populate("assignedTo reviewerId engagementId").sort({ dueDate: 1 }));
});

router.patch("/:id/status", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (req.user.role === "manager") {
    const engagement = await Engagement.findById(task.engagementId).select("managerId");
    const ownsEngagement = engagement && String(engagement.managerId) === String(req.user._id);
    if (!ownsEngagement) return res.status(403).json({ message: "You can review only tasks from your managed engagements" });
  }
  if (req.user.role === "team_member" && String(task.assignedTo) !== String(req.user._id))
    return res.status(403).json({ message: "You can update only your own tasks" });
  const updated = await changeTaskStatus(task, req.body.status, req.user, req.body.note); await audit(req.user._id,"status_change","Task",updated._id,{status:updated.status,note:req.body.note}); res.json(updated);
});

router.patch("/:id/assign", allow("admin", "manager"), async (req, res) => {
  const existing = await Task.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Task not found" });
  const engagement = await Engagement.findById(existing.engagementId).select("managerId");
  if (req.user.role === "manager" && (!engagement || String(engagement.managerId) !== String(req.user._id))) {
    return res.status(403).json({ message: "You can assign only tasks from your engagements" });
  }

  const assignedTo = String(req.body.assignedTo || "").trim();
  if (!assignedTo) return res.status(400).json({ message: "assignedTo is required" });

  const assignee = await User.findOne({ _id: assignedTo, role: "team_member", isActive: true }).select("_id name email role");
  if (!assignee) return res.status(400).json({ message: "assignedTo must be an active team member" });
  await Task.updateOne({ _id: existing._id }, { $set: { assignedTo: assignee._id } });

  const task = await Task.findById(existing._id)
    .populate("assignedTo", "name email role")
    .populate("reviewerId", "name email role")
    .populate("engagementId");

  if (!task || !task.assignedTo || String(task.assignedTo._id) !== String(assignee._id)) {
    return res.status(500).json({ message: "Task assignment could not be persisted" });
  }

  await audit(req.user._id, "assign", "Task", task._id, {
    assignedTo: assignee._id,
    assignedToName: assignee.name,
    previousAssignedTo: existing.assignedTo || null
  });

  res.json(task);
});

router.delete("/:id", allow("admin"), async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  await Task.findByIdAndDelete(req.params.id);
  await audit(req.user._id, "delete", "Task", task._id, { title: task.title });
  res.json({ message: "Task deleted" });
});

router.get("/:id/history", async (req, res) => {
  const task = await Task.findById(req.params.id).populate("history.changedBy", "name email role");
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (req.user.role === "team_member" && String(task.assignedTo) !== String(req.user._id))
    return res.status(403).json({ message: "Forbidden" });
  res.json(task.history || []);
});

router.patch("/:id", allow("admin", "manager"), async (req, res) => {
  const existing = await Task.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Task not found" });
  if (req.user.role === "manager") {
    const engagement = await Engagement.findById(existing.engagementId).select("managerId");
    if (!engagement || String(engagement.managerId) !== String(req.user._id)) return res.status(403).json({ message: "You can update only tasks from your engagements" });
  }
  const allowed = ["title", "description", "dueDate", "assignedTo"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (updates.assignedTo) {
    const member = await User.findOne({_id:updates.assignedTo, role:"team_member", isActive:true});
    if (!member) return res.status(400).json({message:"assignedTo must be an active team member"});
  }
  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  await audit(req.user._id,"update","Task",task._id,updates);
  res.json(task);
});

export default router;
