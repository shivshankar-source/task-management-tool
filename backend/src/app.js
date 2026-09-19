import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import engagementRoutes from "./routes/engagementRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import AuditLog from "./models/AuditLog.js";
import { protect, allow } from "./middleware/auth.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app=express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-management-tool-one.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.get("/api/health",(req,res)=>res.json({success:true,message:"API is running"}));
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/clients",clientRoutes);
app.use("/api/services",serviceRoutes);
app.use("/api/engagements",engagementRoutes);
app.use("/api/tasks",taskRoutes);
app.get("/api/audit-logs", protect, allow("admin"), async (req,res)=>res.json(await AuditLog.find().populate("actor","name email role").sort({createdAt:-1}).limit(500)));
app.use(notFound);
app.use(errorHandler);
export default app;