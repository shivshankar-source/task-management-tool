import React, { useState } from "react";
import TaskModal from "../other/TaskModal";
import AcceptTask from "./AcceptTask";
import NewTask from "./NewTask";
import CompleteTask from "./CompleteTask";
import FailedTask from "./FailedTask";

const TaskList = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openTask = (t) => {
    setSelected(t);
    setOpen(true);
  };

  const tasks = data?.tasks || [];

  return (
    <>
      <TaskModal open={open} onClose={() => setOpen(false)} task={selected} />

      <div
        id="tasklist"
        className="h-[50%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-1 mt-16"
      >
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks available</p>
        ) : (
          tasks.map((elem, idx) => {
            if (elem.active) {
              return (
                <div key={idx} onClick={() => openTask(elem)} className="cursor-pointer">
                  <AcceptTask data={elem} onOpen={openTask}/>
                </div>
              );
            }

            if (elem.newTask) {
              return (
                <div key={idx} onClick={() => openTask(elem)} className="cursor-pointer">
                  <NewTask data={elem} onOpen={openTask}/>
                </div>
              );
            }

            if (elem.completed) {
              return (
                <div key={idx} onClick={() => openTask(elem)} className="cursor-pointer">
                  <CompleteTask key={idx} data={elem} onOpen={openTask} />

                </div>
              );
            }

            if (elem.failed) {
              return (
                <div key={idx} onClick={() => openTask(elem)} className="cursor-pointer">
                  <FailedTask data={elem} onOpen={openTask}/>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </>
  );
};

export default TaskList;
