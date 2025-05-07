import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema(
  {
    repository: String,
    issue: String,
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

const Issue = mongoose.models.Issue || mongoose.model("Issue", issueSchema);

export default Issue;