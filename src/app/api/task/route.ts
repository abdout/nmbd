import connectDB from "@/lib/mongodb";
import Task from "@/components/platform/issue/model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// POST method for creating a new task
export async function POST(request: NextRequest) {
  try {
    const {
      project, task, club, status, priority, duration, desc, label, tag, remark
    } = await request.json();

    console.log("Received data:", { project, task, club, status, priority, duration, desc, label, tag, remark });
    
    await connectDB();
    console.log("Database connected");

    const newTask = new Task({
      project,
      task,
      club,
      status,
      priority,
      duration,
      desc,
      label,
      tag,
      remark
    });

    await newTask.save();
    console.log("Task saved:", newTask);
    
    return NextResponse.json({ message: "Task Created" }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST:", error.message);
      return NextResponse.json({ message: "Error creating task", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}

// GET method for fetching all tasks
export async function GET() {
  try {
    await connectDB();
    console.log("Database connected");

    const tasks = await Task.find();
    console.log("Tasks fetched:", tasks);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET:", error.message);
      return NextResponse.json({ message: "Error fetching tasks", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}

// DELETE method for deleting a task
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    await connectDB();
    console.log("Database connected");

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    console.log("Task deleted:", deletedTask);
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in DELETE:", error.message);
      return NextResponse.json({ message: "Error deleting task", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}