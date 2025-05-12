"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getIssue } from '@/components/platform/issue/action';
import { IssueType } from '@/components/platform/issue/type';
import { useParams } from "next/navigation";
import Loading from '@/components/atom/loading';
import { Issue as IssueIcon } from '@/components/atom/icon';
import { Badge } from "@/components/ui/badge";
import TwitterThread from "@/components/twitter/twitter-thread";

const appendixContent = {
  datasheet: { title: "Datasheet", content: () => <div>Coming soon...</div> },
  manual: { title: "Manual", content: () => <div>Coming soon...</div> },
  calibration: { title: "Calibration", content: () => <div>Coming soon...</div> },
  awesome: { title: "Awesome", content: () => <div>Coming soon...</div> },
};

const statusArabic: Record<string, string> = {
  pending: 'محايد',
  stuck: 'متوقف',
  in_progress: 'جاري',
  done: 'تم',
};

const priorityArabic: Record<string, string> = {
  pending: 'محايد',
  high: 'عالي',
  medium: 'متوسط',
  low: 'منخفض',
};

const IssueDetail = () => {
  const params = useParams();
  const issueId = params.id as string;
  const [activeAppendix, setActiveAppendix] = useState<string | null>(null);
  const [issue, setIssue] = useState<IssueType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const participantAvatars = [
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=facearea&w=80&h=80&facepad=2',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=80&h=80&facepad=2',
  ];

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const response = await getIssue(issueId);
        if (response.error) {
          setError(response.error);
        } else if (response.issue) {
          setIssue({
            ...response.issue,
            _id: response.issue.id,
            issue: response.issue.issue || '',
            club: response.issue.club || '',
            status: response.issue.status || '',
            priority: response.issue.priority || '',
            duration: response.issue.duration || '',
            desc: response.issue.desc || '',
            label: response.issue.label || '',
            tag: response.issue.tag || '',
            remark: response.issue.remark || '',
            repository: response.issue.repository?.title || null,
            repositoryTitle: response.issue.repository?.title || null,
          });
        }
      } catch (err) {
        setError('Failed to load issue');
        console.error('Error fetching issue:', err);
      } finally {
        setLoading(false);
      }
    };

    if (issueId) {
      fetchIssue();
    }
  }, [issueId]);

  const closeAppendixDialog = () => setActiveAppendix(null);

  if (loading) {
    return <Loading />;
  }

  if (error || !issue) {
    return (
      <div className="container px-8 py-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">{error || 'لم يتم العثور على المشكلة'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-8 py-28 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[220px,1fr,1fr] gap-16">
        <div className="flex flex-col justify-start items-start pt-0">
          <div className="rounded-lg w-full max-w-[250px] select-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" className="w-40 h-40 text-foreground"><path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5A9.5 9.5 0 0 0 2.5 12m9.5 2a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 14"/></svg>
          </div>
          <div className="flex flex-row flex-wrap gap-2 mt-2 mb-1">
            <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
              {statusArabic[String(issue.status)] ?? 'غير محدد'}
            </span>
            <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
              {priorityArabic[String(issue.priority)] ?? 'غير محدد'}
            </span>
            {issue.repositoryTitle && (
              <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
                {issue.repositoryTitle}
              </span>
            )}
            {issue.club && (
              <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
                {issue.club}
              </span>
            )}
          </div>
          <div className="mt-8 border-t pt-6 w-full">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-semibold">الوسوم</h3>
              <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">14</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>figma</Badge>
              <Badge>after effects</Badge>
              <Badge>reactjs</Badge>
              <Badge>vibe coding</Badge>
              <Badge>content creator</Badge>
            </div>
           
          </div>
          <div className="mt-8 border-t pt-6 w-full">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-semibold">المشاركين</h3>
              <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">14</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {participantAvatars.map((url, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-muted/50 overflow-hidden border border-muted"
                  title={`مشارك ${i + 1}`}
                >
                  <img src={url} alt={`مشارك ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <button className="mt-4 text-muted-foreground hover:underline text-sm font-medium">
              +6 مشارك
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="font-heading">{issue.issue}</h2>
          <p className="w-[80%] text-muted-foreground text-lg">{issue.desc}</p>
          <div className="mt-8 border-t pt-6">
            
            <TwitterThread />
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