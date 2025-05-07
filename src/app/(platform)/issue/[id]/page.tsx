"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const appendixContent = {
  datasheet: { title: "Datasheet", content: () => <div>Coming soon...</div> },
  manual: { title: "Manual", content: () => <div>Coming soon...</div> },
  calibration: { title: "Calibration", content: () => <div>Coming soon...</div> },
  awesome: { title: "Awesome", content: () => <div>Coming soon...</div> },
};

const placeholderIssue = {
  task: "عنوان المهمة",
  status: "جاري",
  prioity: "عالي",
  duration: "4",
  desc: "هذا وصف توضيحي للمهمة الحالية. يمكن أن يكون طويلاً أو قصيراً حسب الحاجة.",
  project: "مشروع افتراضي",
  club: "الأمانة العامة",
  tag: "وسم افتراضي",
  label: "ملصق افتراضي",
  remark: "ملاحظة افتراضية حول المهمة."
};

const IssueDetail = () => {
  const [activeAppendix, setActiveAppendix] = useState<string | null>(null);
  const task = placeholderIssue;

  const closeAppendixDialog = () => setActiveAppendix(null);

  return (
    <div className="container px-8 py-28 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col justify-start items-start pt-0">
          <div className="rounded-lg w-full max-w-[250px] h-[180px] flex items-center justify-center text-5xl font-bold select-none">
            {task.task?.slice(0, 2) || 'IS'}
          </div>
          <p className="text-xl mx-3 mt-6 mb-3">
            الحالة: <span className="font-bold">{task.status}</span>
          </p>
          <div className="flex items-center gap-4 mx-2">
            <span className="px-6 py-3 text-sm rounded-full font-bold text-center inline-block">
              {task.prioity || '---'}
            </span>
            <span className="text-sm font-medium">{task.duration} ساعة</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold">{task.task}</h1>
          <h2 className="text-2xl mt-2">{task.desc}</h2>
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-3">تفاصيل</h3>
            <ul className="list-disc ml-5 space-y-2">
              <li>المشروع: {task.project}</li>
              <li>الأمانة: {task.club}</li>
              <li>الوسم: {task.tag}</li>
              <li>الملصق: {task.label}</li>
              <li>ملاحظة: {task.remark}</li>
            </ul>
          </div>
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-3">الملحقات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.keys(appendixContent).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveAppendix(key)}
                  className="border p-4 rounded-lg flex flex-col items-start text-left cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium">{appendixContent[key as keyof typeof appendixContent].title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Appendix Dialog */}
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
    </div>
  );
};

export default IssueDetail;