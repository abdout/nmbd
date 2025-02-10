import connectDB from "@/lib/mongodb";
import Task from "@/components/platform/task/model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { 
      newProject: project, 
      newTask: task, 
      newClub: club, 
      newStatus: status, 
      newPriority: priority, 
      newDuration: duration, 
      newDesc: desc, 
      newLabel: label, 
      newTag: tag, 
      newRemark: remark 
    } = await request.json() as { 
      newProject: string, 
      newTask: string, 
      newClub: string, 
      newStatus: string, 
      newPriority: string, 
      newDuration: string, 
      newDesc: string, 
      newLabel: string, 
      newTag: string, 
      newRemark: string 
    };

    await connectDB();
    console.log("Database connected");

    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { project, task, club, status, priority, duration, desc, label, tag, remark },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    console.log("Task updated:", updatedTask);
    return NextResponse.json({ message: "Task updated", task: updatedTask }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in PUT:", error.message);
      return NextResponse.json({ message: "Error updating task", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectDB();
    console.log("Database connected");

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    console.log("Task fetched:", task);
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET:", error.message);
      return NextResponse.json({ message: "Error fetching task", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}