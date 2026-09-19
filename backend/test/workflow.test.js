import test from "node:test";
import assert from "node:assert/strict";
import { changeTaskStatus } from "../src/services/taskService.js";

const user=(role,id="u1")=>({role,_id:id});
const task=(status="not_started",assignedTo="u1")=>({
  status,assignedTo,history:[],save:async function(){return this}
});

test("team member cannot update another user's task", async()=>{
  await assert.rejects(()=>changeTaskStatus(task("not_started","u2"),"in_progress",user("team_member")),/own tasks/);
});
test("invalid workflow transition is rejected", async()=>{
  await assert.rejects(()=>changeTaskStatus(task("not_started"),"completed",user("manager")),/Invalid transition/);
});
test("manager can approve ready work", async()=>{
  const result=await changeTaskStatus(task("ready_for_review"),"completed",user("manager"),"Approved");
  assert.equal(result.status,"completed");
  assert.equal(result.history.length,1);
});
