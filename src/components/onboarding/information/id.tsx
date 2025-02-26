import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface IDProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const ID = ({ register, errors, setValue }: IDProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="w-1/4">
        <Select
          onValueChange={(value) => setValue('maritalStatus', value)}
          defaultValue=""
          dir="rtl"
        >
          <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الحالة">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="single">أعزب</SelectItem>
            <SelectItem value="married">متزوج</SelectItem>
            <SelectItem value="divorced">مطلق</SelectItem>
            <SelectItem value="widowed">أرمل</SelectItem>
          </SelectContent>
        </Select>
        {errors.maritalStatus && (
          <span className="text-red-500 text-sm">{errors.maritalStatus.message}</span>
        )}
      </div>
      
      <div className="w-1/4">
        <Select
          onValueChange={(value) => setValue('gender', value)}
          defaultValue=""
          dir="rtl"
        >
          <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الجنس">
            <SelectValue placeholder="الجنس" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="male">ذكر</SelectItem>
            <SelectItem value="female">أنثى</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <span className="text-red-500 text-sm">{errors.gender.message}</span>
        )}
      </div>
      
      <div className="w-1/4">
        <Select
          onValueChange={(value) => setValue('religion', value)}
          defaultValue=""
          dir="rtl"
        >
          <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الديانة">
            <SelectValue placeholder="الديانة" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            <SelectItem value="islam">الإسلام</SelectItem>
            <SelectItem value="christianity">المسيحية</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
        {errors.religion && (
          <span className="text-red-500 text-sm">{errors.religion.message}</span>
        )}
      </div>
      
      <div className="w-1/4">
        <Input
          id="nationalityId"
          placeholder="الرقم الوطني"
          className="h-9 text-right"
          dir="rtl"
          {...register('nationalityId')}
        />
        {errors.nationalityId && (
          <span className="text-red-500 text-sm">{errors.nationalityId.message}</span>
        )}
      </div>
    </div>
  );
};

export default ID; 