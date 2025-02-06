"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function Hero() {
  return (
    <section className="h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Image Half */}
      <div className="relative h-full lg:order-last">
        <div 
          className="absolute inset-0 lg:inset-[3rem] rounded-none lg:rounded-lg overflow-hidden"
          style={{
            backgroundImage: "url('/stanford.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 lg:bg-gradient-to-r lg:from-black/60 lg:to-black/40" />
        </div>
        
        {/* Content for mobile */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 lg:hidden">
          <div className="max-w-xl text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
              <span className="text-lg font-semibold text-white">Excellence in Education</span>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-white">
            Beautiful Mind, <br />
            <span className="text-white">Curiose. wonder.</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
            A child asks up to 400 questions a day—that natural curiosity is the foundation of learning. Our mission is to keep that spark alive, nurturing curiosity, creativity, and excellence through world-class education.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto"
              >
                Schedule a Visit
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="relative hidden lg:flex items-center p-16 bg-white">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-primary">Excellence in Education</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Beautiful Mind, <br />
            <span className="text-primary">Curiose. wonder.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
          A child asks up to 400 questions a day—that natural curiosity is the foundation of learning. Our mission is to keep that spark alive, nurturing curiosity, creativity, and excellence through world-class education.
          </p>
          <div className="flex flex-row gap-4">
            <Button 
              size="lg" 
              variant="default" 
              className="bg-primary text-white hover:bg-primary/90"
            >
              Schedule a Visit
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-primary border-primary hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}