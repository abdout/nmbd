"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getIssue } from '@/components/platform/issue/action';
import { IssueType } from '@/components/platform/issue/type';
import { useParams } from "next/navigation";
import Loading from '@/components/atom/loading';
import { Issue as IssueIcon } from '@/components/atom/icon';
import { Badge } from "@/components/ui/badge";
import TwitterThread from "@/components/platform/issue/thread";
import Sidebar from '@/components/platform/issue/sidebar';
import IssueHeader from '@/components/platform/issue/issue-header';
import AppendixDialog from '@/components/platform/issue/appendix-dialog';
import IssueThread from "@/components/platform/issue/thread";

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
    <div className="py-8  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[220px,1fr,1fr] gap-16">
        <Sidebar issue={issue} participantAvatars={participantAvatars} />
        <div className="md:col-span-2">
          <IssueHeader issue={{ issue: issue.issue ?? '', desc: issue.desc }} />
          <div className="mt-8 border-t pt-6">
            <IssueThread />
          </div>
        </div>
      </div>
      <AppendixDialog activeAppendix={activeAppendix} closeAppendixDialog={closeAppendixDialog} />
    </div>
  );
};

export default IssueDetail;