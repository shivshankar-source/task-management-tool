import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateTask = ({ employees, setEmployees }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submitHandler = (e) => {
    e.preventDefault();

    const safeEmployees = Array.isArray(employees) ? employees : [];

    if (!assignTo.trim()) return toast.error("Please enter employee first name");
    if (!taskTitle.trim()) return toast.error("Task title required");
    if (!taskDescription.trim()) return toast.error("Task description required");

    const searchName = assignTo.trim().toLowerCase();
    const matchedEmployee = safeEmployees.find((emp) =>
      (emp.firstName || "").toLowerCase().includes(searchName)
    );

    if (!matchedEmployee) {
      return toast.error("Employee name not found ❌");
    }

    const newTask = {
      taskTitle,
      taskDescription,
      taskDate,
      category,
      priority,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };

    const updatedEmployees = safeEmployees.map((emp) => {
      if (emp.id === matchedEmployee.id) {
        return {
          ...emp,
          tasks: [...(emp.tasks || []), newTask],
          taskCounts: {
            ...emp.taskCounts,
            newTask: (emp.taskCounts?.newTask || 0) + 1,
          },
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    toast.success(`Task assigned to ${matchedEmployee.firstName} ✅`);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDate("");
    setCategory("");
    setAssignTo("");
    setPriority("Medium");
  };

  return (
    <form onSubmit={submitHandler} className="w-full">
      
      <div className="mb-3">
        <p className="text-sm mb-1 text-gray-300">Assign To (Employee First Name)</p>
        <input
          type="text"
          value={assignTo}
          onChange={(e) => setAssignTo(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Enter employee first name (Eg: Arjun)"
        />
      </div>

      
      <div className="mb-3">
        <p className="text-sm mb-1 text-gray-300">Priority</p>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      
      <div className="mb-3">
        <p className="text-sm mb-1 text-gray-300">Task Title</p>
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Enter task title..."
        />
      </div>

      
      <div className="mb-3">
        <p className="text-sm mb-1 text-gray-300">Description</p>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Enter task description..."
        />
      </div>

      
      <div className="mb-3">
        <p className="text-sm mb-1 text-gray-300">Task Date</p>
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
        />
      </div>

      
      <div className="mb-5">
        <p className="text-sm mb-1 text-gray-300">Category</p>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          placeholder="Eg: Development, Design..."
        />
      </div>

      <button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded p-2 font-semibold">
        Assign Task
      </button>
    </form>
  );
};

export default CreateTask;
