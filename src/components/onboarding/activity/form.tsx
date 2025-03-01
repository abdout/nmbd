'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { activitySchema, ActivitySchema } from "./validation";
import { useFormContext } from '@/components/onboarding/form-context';
import { useTransition, useEffect, useRef } from "react";
import { submitActivityForm } from "./action";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { getNextRoute } from '../utils';
import { useActionState } from "react";
import ClubSelector from "./club-selector";
import { Skills } from "./skills";
import { Interests } from "./interests";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonthYearRangePicker } from "@/components/atom/month-year-range";
import { AutoComplete, Option } from "@/components/atom/auto-complete";

interface ActivityFormProps {
  user: {
    id: string;
    partyMember?: boolean;
    partyName?: string | null;
    partyStartDate?: Date | null;
    partyEndDate?: Date | null;
    unionMember?: boolean;
    unionName?: string | null;
    unionStartDate?: Date | null;
    unionEndDate?: Date | null;
    ngoMember?: boolean;
    ngoName?: string | null;
    ngoActivity?: string | null;
    clubMember?: boolean;
    clubName?: string | null;
    clubType?: string | null;
    voluntaryMember?: boolean;
    voluntaryName?: string | null;
    voluntaryRole?: string | null;
    voluntaryStartDate?: Date | null;
    voluntaryEndDate?: Date | null;
  };
}

export default function ActivityForm({ user }: ActivityFormProps) {
  const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();
  const startTransition = useTransition()[1];
  const [state] = useActionState(
    (_state: { success: boolean; nextUrl: string }, formData: ActivitySchema) => 
      submitActivityForm(formData),
    {
      success: false,
      nextUrl: '/onboarding/activity'
    }
  );
  const router = useRouter();
  const pathname = usePathname();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // Refs for scroll sections
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const activitySectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // Local form ref that we'll sync with context
  const localFormRef = useRef<HTMLFormElement>(null);

  const {
    watch,
    setValue,
    handleSubmit,
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      selectedActivities: [],
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
      voluntaryMember: false,
      voluntaryName: '',
      voluntaryRole: '',
      voluntaryStartDate: '',
      voluntaryEndDate: '',
      skills: [],
      interests: [],
    }
  });

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

  useEffect(() => {
    // Set form reference for ButtonNavigation
    if (formRef && localFormRef.current) {
      formRef.current = localFormRef.current;
    }
    setCurrentFormId('activity');
  }, [formRef, setCurrentFormId]);

  const onSubmit = (data: ActivitySchema) => {
    startTransition(() => {
      try {
        setIsSubmitting(true);
        console.log('Form data:', data);
        toast.success("تم حفظ معلومات النشاطات بنجاح");
        router.push(getNextRoute(pathname));
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("حدث خطأ أثناء حفظ المعلومات");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (state.success) {
      toast.success("تم حفظ معلومات النشاطات بنجاح");
      router.push(getNextRoute(pathname));
    } else if (!state.success) {
      toast.error("حدث خطأ أثناء حفظ المعلومات");
    }
  }, [state, router, pathname]);

  const parseISODateToDate = (isoDate: string | null | undefined): Date | undefined => {
    if (!isoDate) return undefined;
    return new Date(isoDate);
  };

  const handleDateRangeChange = (activityType: string, range: { from?: Date, to?: Date }) => {
    if (activityType === 'party') {
      setValue('partyStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('partyEndDate', range.to?.toISOString().split('T')[0] || '');
    } else if (activityType === 'union') {
      setValue('unionStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('unionEndDate', range.to?.toISOString().split('T')[0] || '');
    } else if (activityType === 'voluntary') {
      setValue('voluntaryStartDate', range.from?.toISOString().split('T')[0] || '');
      setValue('voluntaryEndDate', range.to?.toISOString().split('T')[0] || '');
    }
  };

  // Options for AutoComplete fields
  const partyOptions: Option[] = [
    { value: "حزب البعث العربي الاشتراكي", label: "حزب البعث العربي الاشتراكي" },
    { value: "الحزب الشيوعي السوري", label: "الحزب الشيوعي السوري" },
    { value: "حزب الاتحاد الاشتراكي العربي", label: "حزب الاتحاد الاشتراكي العربي" },
    { value: "الحزب السوري القومي الاجتماعي", label: "الحزب السوري القومي الاجتماعي" },
    { value: "الحزب الشيوعي السوري (المكتب السياسي)", label: "الحزب الشيوعي السوري (المكتب السياسي)" },
    { value: "الحزب الديمقراطي السوري", label: "الحزب الديمقراطي السوري" },
  ];

  const unionOptions: Option[] = [
    { value: "نقابة المعلمين", label: "نقابة المعلمين" },
    { value: "نقابة المهندسين", label: "نقابة المهندسين" },
    { value: "نقابة الأطباء", label: "نقابة الأطباء" },
    { value: "نقابة المحامين", label: "نقابة المحامين" },
    { value: "نقابة الصيادلة", label: "نقابة الصيادلة" },
    { value: "نقابة الصحفيين", label: "نقابة الصحفيين" },
    { value: "نقابة الفنانين", label: "نقابة الفنانين" },
    { value: "نقابة العمال", label: "نقابة العمال" },
  ];

  const ngoOptions: Option[] = [
    { value: "الهلال الأحمر السوري", label: "الهلال الأحمر السوري" },
    { value: "جمعية البر والإحسان", label: "جمعية البر والإحسان" },
    { value: "منظمة المرأة السورية", label: "منظمة المرأة السورية" },
    { value: "جمعية رعاية الأيتام", label: "جمعية رعاية الأيتام" },
    { value: "مؤسسة الشام الخيرية", label: "مؤسسة الشام الخيرية" },
    { value: "جمعية حماية البيئة", label: "جمعية حماية البيئة" },
  ];

  const ngoActivityOptions: Option[] = [
    { value: "تعليم", label: "تعليم" },
    { value: "صحة", label: "صحة" },
    { value: "إغاثة", label: "إغاثة" },
    { value: "تنمية مجتمعية", label: "تنمية مجتمعية" },
    { value: "دعم نفسي", label: "دعم نفسي" },
    { value: "حماية البيئة", label: "حماية البيئة" },
    { value: "ثقافة وفنون", label: "ثقافة وفنون" },
    { value: "تمكين المرأة", label: "تمكين المرأة" },
  ];

  const clubOptions: Option[] = [
    { value: "نادي الجلاء الرياضي", label: "نادي الجلاء الرياضي" },
    { value: "نادي الوحدة", label: "نادي الوحدة" },
    { value: "نادي تشرين", label: "نادي تشرين" },
    { value: "نادي الكرامة", label: "نادي الكرامة" },
    { value: "نادي الاتحاد", label: "نادي الاتحاد" },
    { value: "نادي حطين", label: "نادي حطين" },
  ];

  const clubTypeOptions: Option[] = [
    { value: "كرة قدم", label: "كرة قدم" },
    { value: "كرة سلة", label: "كرة سلة" },
    { value: "كرة طائرة", label: "كرة طائرة" },
    { value: "سباحة", label: "سباحة" },
    { value: "تنس", label: "تنس" },
    { value: "كاراتيه", label: "كاراتيه" },
    { value: "جودو", label: "جودو" },
    { value: "مصارعة", label: "مصارعة" },
  ];

  const voluntaryOptions: Option[] = [
    { value: "الهلال الأحمر", label: "الهلال الأحمر" },
    { value: "كشافة", label: "كشافة" },
    { value: "مبادرات تطوعية", label: "مبادرات تطوعية" },
    { value: "قوافل إغاثة", label: "قوافل إغاثة" },
    { value: "حملات تنظيف", label: "حملات تنظيف" },
    { value: "تعليم وتدريب", label: "تعليم وتدريب" },
  ];

  const voluntaryRoleOptions: Option[] = [
    { value: "متطوع", label: "متطوع" },
    { value: "منسق", label: "منسق" },
    { value: "قائد فريق", label: "قائد فريق" },
    { value: "مدرب", label: "مدرب" },
    { value: "مساعد إداري", label: "مساعد إداري" },
    { value: "مسؤول تواصل", label: "مسؤول تواصل" },
  ];

  // Helper function to find option by value string
  const getOptionByValue = (options: Option[], value: string | null | undefined): Option | undefined => {
    if (!value) return undefined;
    return options.find(option => option.value === value);
  };

  // Verify CSS matches for both components
  useEffect(() => {
    // Set uniform heights for MonthYearRangePicker to match AutoComplete
    const datePickers = document.querySelectorAll('.month-year-range-picker');
    datePickers.forEach((picker) => {
      if (picker instanceof HTMLElement) {
        picker.style.height = '40px'; // Match AutoComplete height
      }
    });
  }, [selectedActivities]);

  return (
    <form
      ref={localFormRef}
      onSubmit={handleSubmit(onSubmit)}
      className="w-[55%] h-[13rem] flex flex-col -mt-2"
      noValidate
    >
      <ScrollArea className="w-full pr-4">
        <div dir="rtl" className="flex flex-col gap-6 w-full px-4">
          <div ref={skillsSectionRef} className="flex gap-4 w-full">
            <Skills 
              value={watch("skills")} 
              onChange={(skills: string[]) => setValue("skills", skills)} 
            />
            
            <Interests
              value={watch("interests")}
              onChange={(interests: string[]) => setValue("interests", interests)}
            />
          </div>

          <div ref={activitySectionRef} className="w-full">
            <ClubSelector
              setValue={setValue}
              selectedTypes={selectedActivities}
              setSelectedTypes={setSelectedActivities}
            />
          </div>

          <div ref={detailsSectionRef} className="space-y-8 w-full">
            {selectedActivities.includes("سياسي") && (
              <div className="flex flex-col gap-6 border-b pb-7 border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      اسم الحزب
                    </label>
                    <AutoComplete
                      options={partyOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر اسم الحزب"
                      value={getOptionByValue(partyOptions, watch("partyName"))}
                      onValueChange={(option) => setValue("partyName", option.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      الفترة الزمنية
                    </label>
                    <MonthYearRangePicker
                      value={{
                        from: parseISODateToDate(watch('partyStartDate')),
                        to: parseISODateToDate(watch('partyEndDate'))
                      }}
                      onChange={(range) => handleDateRangeChange('party', range)}
                      placeholder="اختر فترة العضوية"
                      className="month-year-range-picker"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedActivities.includes("نقابي") && (
              <div className="flex flex-col gap-6 border-b pb-7 border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      اسم النقابة
                    </label>
                    <AutoComplete
                      options={unionOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر اسم النقابة"
                      value={getOptionByValue(unionOptions, watch("unionName"))}
                      onValueChange={(option) => setValue("unionName", option.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      الفترة الزمنية
                    </label>
                    <MonthYearRangePicker
                      value={{
                        from: parseISODateToDate(watch('unionStartDate')),
                        to: parseISODateToDate(watch('unionEndDate'))
                      }}
                      onChange={(range) => handleDateRangeChange('union', range)}
                      placeholder="اختر فترة العضوية"
                      className="month-year-range-picker"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedActivities.includes("اجتماعي") && (  
              <div className="flex flex-col gap-6 border-b pb-7 border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      اسم المنظمة
                    </label>
                    <AutoComplete
                      options={ngoOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر اسم المنظمة"
                      value={getOptionByValue(ngoOptions, watch("ngoName"))}
                      onValueChange={(option) => setValue("ngoName", option.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      نوع النشاط
                    </label>
                    <AutoComplete
                      options={ngoActivityOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر نوع النشاط"
                      value={getOptionByValue(ngoActivityOptions, watch("ngoActivity"))}
                      onValueChange={(option) => setValue("ngoActivity", option.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedActivities.includes("شبابي") && (
              <div className="flex flex-col gap-6 border-b pb-7 border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      اسم النادي
                    </label>
                    <AutoComplete
                      options={clubOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر اسم النادي"
                      value={getOptionByValue(clubOptions, watch("clubName"))}
                      onValueChange={(option) => setValue("clubName", option.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      نوع النشاط
                    </label>
                    <AutoComplete
                      options={clubTypeOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر نوع النشاط"
                      value={getOptionByValue(clubTypeOptions, watch("clubType"))}
                      onValueChange={(option) => setValue("clubType", option.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedActivities.includes("تطوعي") && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      اسم الجهة التطوعية
                    </label>
                    <AutoComplete
                      options={voluntaryOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر اسم الجهة التطوعية"
                      value={getOptionByValue(voluntaryOptions, watch("voluntaryName") as string)}
                      onValueChange={(option) => setValue("voluntaryName", option.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      الدور التطوعي
                    </label>
                    <AutoComplete
                      options={voluntaryRoleOptions}
                      emptyMessage="لا توجد نتائج"
                      placeholder="اختر الدور التطوعي"
                      value={getOptionByValue(voluntaryRoleOptions, watch("voluntaryRole") as string)}
                      onValueChange={(option) => setValue("voluntaryRole", option.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 pb-2">
                      الفترة الزمنية
                    </label>
                    <MonthYearRangePicker
                      value={{
                        from: parseISODateToDate(watch('voluntaryStartDate') as string),
                        to: parseISODateToDate(watch('voluntaryEndDate') as string)
                      }}
                      onChange={(range) => handleDateRangeChange('voluntary', range)}
                      placeholder="اختر فترة التطوع"
                      className="month-year-range-picker"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
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