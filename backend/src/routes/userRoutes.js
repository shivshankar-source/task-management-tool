import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, allow } from "../middleware/auth.js";
import { audit } from "../services/auditService.js";
const router = Router();
router.use(protect);

router.get("/me", async (req,res)=>{
  const user = await User.findById(req.user._id).select("-passwordHash");
  if (!user) return res.status(404).json({message:"User not found"});
  res.json(user);
});

router.patch("/me", async (req,res)=>{
  const { name, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!user) return res.status(404).json({message:"User not found"});

  const updates = {};
  if (name !== undefined) {
    const normalizedName = String(name).trim();
    if (!normalizedName) return res.status(400).json({message:"Name cannot be empty"});
    updates.name = normalizedName;
  }
  if (email !== undefined) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({message:"Email cannot be empty"});
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (existing) return res.status(409).json({message:"Email is already in use"});
    updates.email = normalizedEmail;
  }

  if (newPassword !== undefined && String(newPassword).length > 0) {
    if (!currentPassword) return res.status(400).json({message:"Current password is required"});
    const valid = await bcrypt.compare(String(currentPassword), user.passwordHash);
    if (!valid) return res.status(400).json({message:"Current password is incorrect"});
    if (String(newPassword).length < 6) return res.status(400).json({message:"New password must be at least 6 characters"});
    if (String(currentPassword) === String(newPassword)) return res.status(400).json({message:"New password must be different from the current password"});
    updates.passwordHash = await bcrypt.hash(String(newPassword), 10);
  }

  if (!Object.keys(updates).length) return res.status(400).json({message:"No profile changes provided"});

  const before = { name: user.name, email: user.email, role: user.role };
  const updated = await User.findByIdAndUpdate(user._id, updates, { new:true, runValidators:true }).select("-passwordHash");
  await audit(req.user._id, "update", "User", updated._id, {
    before,
    after: { name: updated.name, email: updated.email, role: updated.role },
    passwordChanged: Boolean(updates.passwordHash)
  });
  res.json(updated);
});
router.use(allow("admin", "manager"));

router.get("/", async (req,res)=>{
  const filter = req.user.role === "manager" ? { role: "team_member", isActive: true } : {};
  res.json(await User.find(filter).select("-passwordHash"));
});
router.post("/", allow("admin"), async (req,res) => {
  const { name,email,password,role } = req.body;
  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!name || !normalizedEmail || !password || !normalizedRole) return res.status(400).json({message:"All fields are required"});
  if (!["admin","manager","team_member"].includes(normalizedRole)) return res.status(400).json({message:"Invalid role"});
  const user = await User.create({name,email:normalizedEmail,passwordHash:await bcrypt.hash(password,10),role:normalizedRole});
  await audit(req.user._id,"create","User",user._id,{email,role});
  res.status(201).json(user);
});
router.patch("/:id", allow("admin"), async (req,res)=>{
  const updates={};
  for (const key of ["name","email","role","isActive"]) if (key in req.body) updates[key]=req.body[key];
  const user=await User.findByIdAndUpdate(req.params.id,updates,{new:true,runValidators:true}).select("-passwordHash");
  if(!user)return res.status(404).json({message:"User not found"});
  await audit(req.user._id,"update","User",user._id,updates); res.json(user);
});
router.delete("/:id", allow("admin"), async(req,res)=>{
  if(String(req.user._id)===String(req.params.id)) return res.status(400).json({message:"You cannot delete yourself"});
  const user=await User.findByIdAndDelete(req.params.id); if(!user)return res.status(404).json({message:"User not found"});
  await audit(req.user._id,"delete","User",user._id,{email:user.email}); res.json({message:"User deleted"});
});
export default router;
