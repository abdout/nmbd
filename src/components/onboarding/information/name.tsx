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
        <Input
          id="name"
          placeholder="اسم المستخدم"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <Input
          id="fullname"
          placeholder="الاسم الكامل"
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