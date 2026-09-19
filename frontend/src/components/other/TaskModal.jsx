import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panel = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function TaskModal({ open, onClose, task }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0f172a]/90 shadow-2xl p-6"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-semibold">{task?.taskTitle || "Task"}</h2>
            <p className="mt-2 text-white/70">{task?.taskDescription || "No description"}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white/60">Category</p>
                <p className="font-medium">{task?.category || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white/60">Date</p>
                <p className="font-medium">{task?.taskDate || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white/60">Status</p>
                <p className="font-medium">
                  {task?.active ? "Active" : task?.completed ? "Completed" : task?.failed ? "Failed" : "New"}
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-white/60">Priority</p>
                <p className="font-medium">{task?.priority || "Normal"}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}