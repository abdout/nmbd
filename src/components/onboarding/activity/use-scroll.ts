import { useEffect, useRef, RefObject } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { ActivitySchema } from './validation';

interface ScrollRefs {
  skillsSectionRef: RefObject<HTMLDivElement | null>;
  activitySectionRef: RefObject<HTMLDivElement | null>;
  detailsSectionRef: RefObject<HTMLDivElement | null>;
}

export function useScroll(
  watch: UseFormWatch<ActivitySchema>,
  selectedActivities: string[]
): ScrollRefs {
  // Create refs for scroll sections
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // Watch skills and interests for auto-scroll
  const skills = watch("skills");
  const interests = watch("interests");

  // Auto-scroll effect when skills and interests are filled
  useEffect(() => {
    if (skills.length > 0 && interests.length > 0) {
      const timer = setTimeout(() => {
        if (activitySectionRef.current) {
          activitySectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [skills, interests]);

  // Auto-scroll effect when activities are selected
  useEffect(() => {
    if (selectedActivities.length > 0) {
      const timer = setTimeout(() => {
        if (detailsSectionRef.current) {
          detailsSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedActivities]);

  return {
    skillsSectionRef,
    activitySectionRef,
    detailsSectionRef
  };
} 