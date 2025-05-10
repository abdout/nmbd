"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  
  useEffect(() => {
    redirect(`/club/${id}/about`);
  }, [id]);
  
  return null;
}