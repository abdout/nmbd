import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FocusContainer } from "@/components/onboarding/focus-container";
import { EducationSchema } from "./validation";

interface OccupationProps {
  register: UseFormRegister<EducationSchema>;
  errors: FieldErrors<EducationSchema>;
  educationLevel: string;
}

const Occupation = ({
  register,
  errors,
  educationLevel
}: OccupationProps) => {
  if (educationLevel === 'student') {
    return null;
  }

  return (
    <div className="pt-4 border-t">
      <p className="text-sm font-semibold">الدرجة الوظيفية:</p>
      <FocusContainer>
        {({ getClassName, handleFocus, handleBlur }) => (
          <div className="grid grid-cols-1 md:flex md:flex-row gap-4 md:gap-6 w-full mb-4 md:mb-1 mt-2">
            {/* Current occupation/rank */}
            <div className={getClassName('company', 'occupation')}>
              <Input
                id="employmentSector"
                placeholder="المنصب الحالي"
                {...register('employmentSector')}
                onFocus={handleFocus('occupation')}
                onBlur={handleBlur}
              />
              {errors.employmentSector && (
                <span className="text-red-500 text-sm">{errors.employmentSector.message}</span>
              )}
            </div>

            {/* Company name */}
            <div className={getClassName('occupation', 'company')}>
              <Input
                id="companyName"
                placeholder="اسم الشركة"
                {...register('companyName')}
                onFocus={handleFocus('company')}
                onBlur={handleBlur}
              />
              {errors.companyName && (
                <span className="text-red-500 text-sm">{errors.companyName.message}</span>
              )}
            </div>
          </div>
        )}
      </FocusContainer>
    </div>
  );
};

export default Occupation; 