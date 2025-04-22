"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="mt-4 grid grid-cols-4 gap-4  rounded-2xl ">
      {[
        { value: timeLeft.days, label: "يوم" },
        { value: timeLeft.hours, label: "ساعة" },
        { value: timeLeft.minutes, label: "دقيقة" },
        { value: timeLeft.seconds, label: "ثانية" }
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center bg-white/5 p-2 px-3 rounded-xl">
          <motion.span 
            key={item.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-2xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
          >
            {item.value}
          </motion.span>
          {/* <span className="text-sm font-medium text-white/70">{item.label}</span> */}
        </div>
      ))}
    </div>
  );
}