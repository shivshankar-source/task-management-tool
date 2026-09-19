
const transitions = {
  not_started: ["in_progress"],
  in_progress: ["waiting_for_client", "ready_for_review"],
  waiting_for_client: ["in_progress"],
  ready_for_review: ["completed", "changes_requested"],
  changes_requested: ["in_progress"],
  completed: []
};

export async function changeTaskStatus(task, nextStatus, user, note = "") {
  if (user.role === "team_member" && String(task.assignedTo) !== String(user._id))
    throw Object.assign(new Error("You can update only your own tasks"), { status: 403 });

  if (user.role === "team_member" && nextStatus === "completed")
    throw Object.assign(new Error("Only a manager can approve work"), { status: 403 });

  if (!transitions[task.status]?.includes(nextStatus))
    throw Object.assign(new Error(`Invalid transition: ${task.status} -> ${nextStatus}`), { status: 400 });

  if (nextStatus === "completed" && !["admin", "manager"].includes(user.role))
    throw Object.assign(new Error("Only managers can approve work"), { status: 403 });

  task.history.push({ from: task.status, to: nextStatus, changedBy: user._id, note });
  task.status = nextStatus;
  if (note) task.submissionNote = note;
  return task.save();
}