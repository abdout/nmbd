'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from '@/components/onboarding/form-context';
import { ScrollArea } from "@/components/ui/scroll-area";
import ClubSelector from "./club-selector";
import Club from "./club";
import { Skills } from "./skill";
import { Interests } from "./interest";
import { ActivityUser } from './type';
import { activitySchema, ActivitySchema } from './validation';
import { useScroll } from './use-scroll';
import { useDate } from './use-date';
import { useUtils } from './use-utils';
import { useSubmit } from './use-submit';
import { useInitActivities } from './use-init';
import { useFocus } from '@/components/onboarding/use-focus';


interface ActivityFormProps {
  user: ActivityUser;
}

export default function ActivityForm({ user }: ActivityFormProps) {
  const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();

  // Initialize default activities (helper function)
  const getInitialActivities = () => {
    const activities: string[] = [];
    if (user.partyMember) activities.push("سياسي");
    if (user.unionMember) activities.push("نقابي");
    if (user.ngoMember) activities.push("اجتماعي");
    if (user.clubMember) activities.push("شبابي");
    if (user.voluntaryMember) activities.push("تطوعي");
    return activities;
  };
  
  // Initialize form with useForm
  const {
    watch,
    setValue,
    handleSubmit,
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      selectedActivities: getInitialActivities(),
      partyMember: user.partyMember || false,
      partyName: user.partyName || '',
      partyStartDate: user.partyStartDate?.toISOString().split('T')[0] || '',
      partyEndDate: user.partyEndDate?.toISOString().split('T')[0] || '',
      unionMember: user.unionMember || false,
      unionName: user.unionName || '',
      unionStartDate: user.unionStartDate?.toISOString().split('T')[0] || '',
      unionEndDate: user.unionEndDate?.toISOString().split('T')[0] || '',
      ngoMember: user.ngoMember || false,
      ngoName: user.ngoName || '',
      ngoActivity: user.ngoActivity || '',
      clubMember: user.clubMember || false,
      clubName: user.clubName || '',
      clubType: user.clubType || '',
      voluntaryMember: user.voluntaryMember || false,
      voluntaryName: user.voluntaryName || '',
      voluntaryRole: user.voluntaryRole || '',
      voluntaryStartDate: user.voluntaryStartDate?.toISOString().split('T')[0] || '',
      voluntaryEndDate: user.voluntaryEndDate?.toISOString().split('T')[0] || '',
      skills: Array.isArray(user.skills) ? [...user.skills] : [],
      interests: Array.isArray(user.interests) ? [...user.interests] : [],
    }
  });
  
  // Now we can use our activity initialization hook after useForm is initialized
  const {
    selectedActivities,
    setSelectedActivities
  } = useInitActivities(user, watch, setValue);

  // custom hooks
  const { parseISODateToDate, handleDateRangeChange } = useDate(setValue);
  const { getOptionByValue, renderSchemaWarning } = useUtils();
  const { onSubmit } = useSubmit({ handleSubmit, setIsSubmitting });
  const {
    skillsSectionRef,
    activitySectionRef,
    detailsSectionRef
  } = useScroll(watch, selectedActivities);

  // Local form ref that we'll sync with context
  const localFormRef = useRef<HTMLFormElement>(null);

  // Add focus motion effect for Skills and Interests fields
  const { getClassName, handleFocus, handleBlur } = useFocus<'skills' | 'interests'>(
    '', // default class
    '60%', // expanded width
    '40%', // shrunk width
    '50%'  // equal width
  );

  useEffect(() => {
    // Set form reference for ButtonNavigation
    if (formRef && localFormRef.current) {
      formRef.current = localFormRef.current;
    }
    setCurrentFormId('activity');
  }, [formRef, setCurrentFormId]);

  return (
    <form
      ref={localFormRef}
      onSubmit={onSubmit}
      className="w-full h-[22rem] md:w-[55%] md:h-[13rem] flex flex-col p-2"
      noValidate
    >
      <ScrollArea className="w-full pr-4">
        <div dir="rtl" className="flex flex-col gap-8 w-full px-4">
          <div ref={skillsSectionRef} className="flex flex-col md:flex-row gap-4">
            <div className={getClassName('skills')}>
              <Skills 
                value={watch("skills")} 
                onChange={(skills: string[]) => setValue("skills", skills)} 
                onFocus={handleFocus('skills')}
                onBlur={handleBlur}
              />
            </div>
            
            <div className={getClassName('interests')}>
              <Interests
                value={watch("interests")}
                onChange={(interests: string[]) => setValue("interests", interests)}
                onFocus={handleFocus('interests')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div ref={activitySectionRef} className="w-full">
            <ClubSelector
              setValue={setValue}
              selectedTypes={selectedActivities}
              setSelectedTypes={setSelectedActivities}
            />
          </div>

          <Club
            watch={watch}
            setValue={setValue}
            getOptionByValue={getOptionByValue}
            renderSchemaWarning={renderSchemaWarning}
            parseISODateToDate={parseISODateToDate}
            handleDateRangeChange={handleDateRangeChange}
            selectedActivities={selectedActivities}
            detailsSectionRef={detailsSectionRef}
          />
        </div>
      </ScrollArea>

      {/* Hidden submit button for form submission */}
      <button
        id="submit-activity"
        type="submit"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
    </form>
  );
} 