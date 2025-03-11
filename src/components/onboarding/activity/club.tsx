'use client';

import { AutoComplete, Option } from "@/components/atom/auto-complete";
import { MonthYearRangePicker } from "@/components/atom/month-year-range";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ActivitySchema } from "./validation";
import { 
  PARTY_OPTIONS,
  UNION_OPTIONS,
  NGO_OPTIONS,
  NGO_ACTIVITY_OPTIONS,
  CLUB_OPTIONS,
  CLUB_TYPE_OPTIONS,
  VOLUNTARY_OPTIONS,
} from './constant';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ClubProps {
  watch: UseFormWatch<ActivitySchema>;
  setValue: UseFormSetValue<ActivitySchema>;
  getOptionByValue: (options: Option[], value: string | null | undefined) => Option | undefined;
  renderSchemaWarning: (field: string) => React.ReactNode;
  parseISODateToDate: (isoDate: string | null | undefined) => Date | undefined;
  handleDateRangeChange: (activityType: string, range: DateRange) => void;
  selectedActivities: string[];
  detailsSectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function Club({
  watch,
  setValue,
  getOptionByValue,
  // renderSchemaWarning,
  parseISODateToDate,
  handleDateRangeChange,
  selectedActivities,
  detailsSectionRef
}: ClubProps) {
  return (
    <div ref={detailsSectionRef} className="space-y-8 w-full">
      {/* Political Party Section */}
      {selectedActivities.includes("سياسي") && (
        <div className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم الحزب
              </label>
              <AutoComplete
                options={PARTY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم الحزب"
                value={getOptionByValue(PARTY_OPTIONS, watch("partyName"))}
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

      {/* Union Section */}
      {selectedActivities.includes("نقابي") && (
        <div className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم النقابة
              </label>
              <AutoComplete
                options={UNION_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم النقابة"
                value={getOptionByValue(UNION_OPTIONS, watch("unionName"))}
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

      {/* NGO Section */}
      {selectedActivities.includes("اجتماعي") && (
        <div className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم المنظمة
              </label>
              <AutoComplete
                options={NGO_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم المنظمة"
                value={getOptionByValue(NGO_OPTIONS, watch("ngoName"))}
                onValueChange={(option) => setValue("ngoName", option.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                نوع النشاط
              </label>
              <AutoComplete
                options={NGO_ACTIVITY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر نوع النشاط"
                value={getOptionByValue(NGO_ACTIVITY_OPTIONS, watch("ngoActivity"))}
                onValueChange={(option) => setValue("ngoActivity", option.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Youth Club Section */}
      {selectedActivities.includes("شبابي") && (
        <div className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم النادي
              </label>
              <AutoComplete
                options={CLUB_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم النادي"
                value={getOptionByValue(CLUB_OPTIONS, watch("clubName"))}
                onValueChange={(option) => setValue("clubName", option.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                نوع النادي
              </label>
              <AutoComplete
                options={CLUB_TYPE_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر نوع النادي"
                value={getOptionByValue(CLUB_TYPE_OPTIONS, watch("clubType"))}
                onValueChange={(option) => setValue("clubType", option.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Voluntary Section */}
      {selectedActivities.includes("تطوعي") && (
        <div className="flex flex-col gap-6 border-t pt-7 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                اسم المبادرة
              </label>
              <AutoComplete
                options={VOLUNTARY_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر اسم المبادرة"
                value={getOptionByValue(VOLUNTARY_OPTIONS, watch("voluntaryName"))}
                onValueChange={(option) => setValue("voluntaryName", option.value)}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                الدور
              </label>
              <AutoComplete
                options={VOLUNTARY_ROLE_OPTIONS}
                emptyMessage="لا توجد نتائج"
                placeholder="اختر الدور"
                value={getOptionByValue(VOLUNTARY_ROLE_OPTIONS, watch("voluntaryRole"))}
                onValueChange={(option) => setValue("voluntaryRole", option.value)}
              />
            </div> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  items-center gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 pb-2">
                الفترة الزمنية
              </label>
              <MonthYearRangePicker
                value={{
                  from: parseISODateToDate(watch('voluntaryStartDate')),
                  to: parseISODateToDate(watch('voluntaryEndDate'))
                }}
                onChange={(range) => handleDateRangeChange('voluntary', range)}
                placeholder="اختر فترة التطوع"
                className="month-year-range-picker"
              />
            </div>
          </div>
          {/* {renderSchemaWarning('voluntary')} */}
        </div>
      )}
    </div>
  );
} 