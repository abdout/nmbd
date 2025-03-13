"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "./constant";
import { Users, DollarSign, Building2, Target, TrendingUp, GitBranch, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.05 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

function ProjectCards({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <motion.button
              key={`button-${active.name}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-5 w-5"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[80%] px-4 pb-4 flex flex-col bg-white dark:bg-neutral-900 sm:rounded-xl overflow-hidden"
            >
              <div>
                <motion.div 
                  layoutId={`image-${active.name}-${id}`}
                  className="flex items-center gap-4 p-4 border-b"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image 
                      src={active.src} 
                      alt={active.name} 
                      width={50} 
                      height={50} 
                      className=""
                    />
                  </motion.div>
                  <motion.h3
                    layoutId={`title-${active.name}-${id}`}
                    className="font-heading text-3xl font-extrabold"
                  >
                    {active.name}
                  </motion.h3>
                </motion.div>
                <div className="p-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Contributors")?.desc}</p>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Contributors</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Investor")?.desc?.replace(" Dinars", "")}</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Investment</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Sponsor")?.desc}</p>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Sponsors</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Issue")?.desc?.replace(" Dinars", "")}</p>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Issue</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Valuation")?.desc?.replace(" Dinars", "")}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Valuation</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col p-2">
                        <p className="text-lg font-semibold mb-1">{active.papers.find(p => p.title === "Phase")?.desc}</p>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3 text-neutral-500" />
                          <p className="text-[10px] text-neutral-500">Phase</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="grid grid-cols-4 gap-7 items-center justify-center">
        {projects.map((project) => (
          <motion.div
            layoutId={`card-${project.name}-${id}`}
            key={project.name}
            onClick={() => setActive(project)}
            className="relative flex flex-col items-center justify-center p-4 cursor-pointer"
          >
            <motion.div layoutId={`image-${project.name}-${id}`} className="flex items-center justify-center">
              <Image 
                src={project.src} 
                alt={project.name} 
                width={80} 
                height={80} 
                className="p-3" 
              />
            </motion.div>
            <motion.h4 layoutId={`title-${project.name}-${id}`}>
              {project.name}
            </motion.h4>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default ProjectCards; 