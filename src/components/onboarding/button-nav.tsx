'use client';
import React from 'react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

const ButtonNavigation = () => {
    const router = useRouter()
    
  return (
    <div>
        <div className="flex justify-center space-x-reverse space-x-4 pt-10">
      <Button onClick={() => router.back()} size="sm" className='bg-neutral-950 hover:bg-neutral-800'>
        <ArrowRight className="ml-2 h-4 w-4" /> السابق
      </Button>
      <Button onClick={() => router.forward()} variant="outline" size="sm">
        التالي <ArrowLeft className="mr-2 h-4 w-4" />
      </Button>
    </div>
    </div>
  )
}

export default ButtonNavigation



