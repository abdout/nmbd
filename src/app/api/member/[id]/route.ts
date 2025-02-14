import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Member from "@/components/platform/member/model";

type Context = {
  params: {
    id: string;
  };
};

export async function PUT(request: NextRequest, context: Context) {
  const { id } = context.params;
  const { newName: name, newDob: dob, newAddress: address, newGender: gender, newRank: rank, newInterest: interest, newSkill: skill, newClub: club, newImage: image, newContact: contact } = await request.json() as { 
    newName: string, 
    newDob: string, 
    newAddress: string, 
    newGender: string, 
    newRank: string, 
    newInterest: string, 
    newSkill: string, 
    newClub: string,
    newImage: string,
    newContact: { phone: string, facebook: string, whatsapp: string } 
  };
  await connectDB();
  await Member.findByIdAndUpdate(id, { name, dob, address, gender, rank, interest, skill, club, image, contact });
  return NextResponse.json({ message: "Member updated" }, { status: 200 });
}

export async function GET(request: NextRequest, context: Context) {
  const { id } = context.params;
  await connectDB();
  const member = await Member.findById(id);
  return NextResponse.json({ member }, { status: 200 });
}