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
        <div key={index} className="flex flex-col items-center bg-white/5 p-1 md:p-2 px-2 md:px-3 rounded-lg md:rounded-xl">
          <motion.span 
            key={item.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
          >
            {item.value}
          </motion.span>
          {/* <span className="text-sm font-medium text-white/70">{item.label}</span> */}
        </div>
      ))}
    </div>
  );
}

// export function LampDemo() {
//   return (
//     <LampContainer>
//       <motion.div
//         initial={{ opacity: 0.5, y: 100 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{
//           delay: 0.3,
//           duration: 0.8,
//           ease: "easeInOut",
//         }}
//         className="flex items-center gap-8 -translate-y-16"
//       >
//         <div className="flex flexitems-center gap-2">
//         <h1 className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-500 py-4 bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:text-6xl max-w-2xl">
//           المؤتمر العام الأول للحركة الوطنية
//         </h1>
        
//         <div className="flex items-center gap-8 text-slate-700 dark:text-slate-300">
//           <div className="flex items-center gap-2">
//             <IconMapPin className="w-5 h-5" />
//             <span className="text-lg md:text-xl">قاعة الصداقة</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <IconCalendar className="w-5 h-5" />
//             <span className="text-lg md:text-xl">07-04-2025</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <IconClock className="w-5 h-5" />
//             <span className="text-lg md:text-xl">10:00 صباحاً</span>
//           </div>
//         </div>
//         </div>

    

//         <Countdown targetDate={new Date('2025-04-07T10:00:00')} />
//       </motion.div>
//     </LampContainer>
//   );
// }