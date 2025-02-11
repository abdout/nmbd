"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Countdown } from "./content";

export function LampMobile () {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-4xl"
      >
        <div className="flex flex-col  items-center justify-center">
          <h3 className="font-bold">المؤتمر العام الاول</h3>
          <div className="mt-4 flex items-center gap-8 text-[16px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>قاعة الصداقة</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>14-ابريل-2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>7:00 مساء</span>
              </div> */}
            </div>
            <Countdown targetDate={new Date("2025-04-14T16:00:00")} /> 
        </div>
      </motion.div>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "relative flex h-[50%] flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
          className
        )}
      >
        <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 translate-y-36">
          <motion.div
            initial={{ opacity: 0.5, width: "8rem" }}
            whileInView={{ opacity: 1, width: "16rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-40 overflow-visible bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] -translate-y-8"
          >
            <div className="absolute w-[100%] left-0 bg-slate-950 h-28 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-28 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0.5, width: "8rem" }}
            whileInView={{ opacity: 1, width: "16rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-40 bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top] -translate-y-8"
          >
            <div className="absolute w-28 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-slate-950 h-28 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>

          {/* Light effects */}
          <div className="absolute inset-auto z-50 h-24 w-[16rem] -translate-y-[8rem] rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
          <motion.div
            initial={{ width: "4rem" }}
            whileInView={{ width: "10rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-30 h-24 -translate-y-[8rem] rounded-full bg-cyan-400 blur-2xl"
          ></motion.div>
          <motion.div
            initial={{ width: "8rem" }}
            whileInView={{ width: "16rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-50 h-0.5 -translate-y-[8rem] bg-cyan-400"
          ></motion.div>

          <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950"></div>
        </div>

        <div className="relative z-50 flex -translate-y-5 flex-col items-center px-5">
          {children}
        </div>
      </div>
    </div>
  );
};
