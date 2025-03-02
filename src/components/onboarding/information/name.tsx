import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InformationSchema } from "./validation";

interface NameProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
}

const Name = ({ register, errors }: NameProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        {/* <label htmlFor="name" className="block mb-2 text-sm font-medium">
          اسم المستخدم
        </label> */}
        <Input
          id="name"
          placeholder="اسم المستخدم"
          dir="rtl"
          className="text-right"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="fullname" className="block mb-2 text-sm font-medium">
          الاسم الكامل
        </label>
        <Input
          id="fullname"
          placeholder="الاسم الكامل"
          dir="rtl"
          className="text-right"
          {...register('fullname')}
        />
        {errors.fullname && (
          <span className="text-red-500 text-sm">{errors.fullname.message}</span>
        )}
      </div>
    </div>
  );
};

export default Name; 