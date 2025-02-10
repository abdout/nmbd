import connectDB from "@/lib/mongodb";
import Article from "@/components/template/article/model";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  const { newTitle: title, newDesc: desc, newBody: body, newAuthor: author, newImage: image, newSlug, newCatSlug: catSlug } = await request.json();
  
  await connectDB();
  await Article.findByIdAndUpdate(id, { title, desc, body, image, author, slug: newSlug, catSlug });
  return NextResponse.json({ message: "Article updated" }, { status: 200 });
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  await connectDB();
  const article = await Article.findById(id);
  return NextResponse.json({ article }, { status: 200 });
}