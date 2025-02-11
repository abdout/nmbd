"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Countdown } from "./countdown";
// import { LampContainer } from "./lamp-desktop";

export function LampContent() {
  return (  
    // <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br  from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-4xl"
      >
        <div className="flex flex-col  items-center justify-center">
          <h1>المؤتمر العام الاول</h1>
          <div className="mt-4 flex items-center gap-8 text-[16px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>قاعة الصداقة</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>14-ابريل-2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>7:00 مساء</span>
              </div>
            </div>
            <Countdown targetDate={new Date("2025-04-14T16:00:00")} /> 
        </div>
      </motion.div>
    // </LampContainer>
  );
}
