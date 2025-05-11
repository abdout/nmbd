"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributeSchema, type ContributeSchema } from "./validation";
import { Textarea } from "@/components/ui/textarea";

interface FormProps {
  type: "create" | "update";
  data?: ContributeSchema;
}

export default function Form({ type, data }: FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContributeSchema>({
    resolver: zodResolver(contributeSchema),
    defaultValues: data,
  });

  const onSubmit = (values: ContributeSchema) => {
    // TODO: call server action
    alert(JSON.stringify(values));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-1">
        الدعوة
        <Textarea 
        {...register("contribution")}
        placeholder="حابب تدعو لشنو؟ أو تتطوع في شنو؟"
        className="border rounded p-2 h-28" />
        {errors.contribution && <span className="text-red-500">{errors.contribution.message}</span>}
      </label>
      <button id="submit-contribute" type="submit" className="hidden">{type === "update" ? "تحديث" : "حفظ"}</button>
    </form>
  );
} 