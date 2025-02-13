import mongoose, { Schema } from "mongoose";


const taskSchema = new Schema(
  {
    project: String,
    task: String,
    club: String,
    status: String,
    priority: String,
    duration: String,
    desc: String,
    label: String,
    tag: String,
    remark: String, 
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;