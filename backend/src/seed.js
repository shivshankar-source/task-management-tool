import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Client from "./models/Client.js";
import ServiceType from "./models/ServiceType.js";
import TaskTemplate from "./models/TaskTemplate.js";

await connectDB();
await Promise.all([User.deleteMany({}),Client.deleteMany({}),ServiceType.deleteMany({}),TaskTemplate.deleteMany({})]);
const passwordHash=await bcrypt.hash("123456",10);
await User.insertMany([
 {name:"Admin User",email:"admin@example.com",passwordHash,role:"admin"},
 {name:"Manager One",email:"manager@example.com",passwordHash,role:"manager"},
 {name:"Arjun Employee",email:"employee@example.com",passwordHash,role:"team_member"}
]);
const clients=await Client.insertMany([{name:"ABC Pvt Ltd",email:"abc@example.com"},{name:"Demo Industries",email:"demo@example.com"}]);
const service=await ServiceType.create({name:"Monthly GST Compliance",engagementType:"recurring",recurrence:"monthly"});
await TaskTemplate.insertMany([
 {serviceTypeId:service._id,title:"Collect client documents",defaultDueDays:2,order:1},
 {serviceTypeId:service._id,title:"Prepare GST calculation",defaultDueDays:5,order:2},
 {serviceTypeId:service._id,title:"Review GST return",defaultDueDays:7,order:3}
]);
console.log("Seed complete",clients.length,"clients"); process.exit(0);