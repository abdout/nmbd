import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const appendixContent = {
  datasheet: { title: "Datasheet", content: () => <div>Coming soon...</div> },
  manual: { title: "Manual", content: () => <div>Coming soon...</div> },
  calibration: { title: "Calibration", content: () => <div>Coming soon...</div> },
  awesome: { title: "Awesome", content: () => <div>Coming soon...</div> },
};

interface AppendixDialogProps {
  activeAppendix: string | null;
  closeAppendixDialog: () => void;
}

export default function AppendixDialog({ activeAppendix, closeAppendixDialog }: AppendixDialogProps) {
  return (
    <AnimatePresence>
      {activeAppendix && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={closeAppendixDialog}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-4 md:inset-10 z-50 rounded-lg overflow-hidden flex flex-col bg-white"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {appendixContent[activeAppendix as keyof typeof appendixContent]?.title || 'Document'}
              </h3>
              <button
                onClick={closeAppendixDialog}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {appendixContent[activeAppendix as keyof typeof appendixContent]?.content()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 