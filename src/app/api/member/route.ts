import connectDB from "@/lib/mongodb";
import Member from "@/components/template/member/model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// POST method for creating a new member
export async function POST(request: NextRequest) {
  try {
    const {
      name, dob, address, gender, rank, interest, skill, club, image, contact
    } = await request.json();

    console.log("Received data:", { name, dob, address, gender, rank, interest, skill, club, image, contact });
    
    await connectDB();
    console.log("Database connected");

    const member = new Member({
      name,
      dob,
      address,
      gender,
      rank,
      interest,
      skill,
      club,
      image,
      contact
    });

    await member.save();
    console.log("Member saved:", member);
    
    return NextResponse.json({ message: "Member Created" }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST:", error.message);
      return NextResponse.json({ message: "Error creating member", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}

// GET method for fetching all members
export async function GET() {
  try {
    await connectDB();
    console.log("Database connected");

    const members = await Member.find();
    console.log("Members fetched:", members);

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET:", error.message);
      return NextResponse.json({ message: "Error fetching members", error: error.message }, { status: 500 });
    }
    console.error("Unexpected error", error);
    return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  await connectDB();
  await Member.findByIdAndDelete(id);
  return NextResponse.json({ message: "Member deleted" }, { status: 200 });
}