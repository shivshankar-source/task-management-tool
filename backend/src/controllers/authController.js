import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const token = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10), role: "team_member" });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: token(user) });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
    return res.status(401).json({ message: "Invalid credentials" });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: token(user) });
}