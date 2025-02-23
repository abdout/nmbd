"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { informationSchema, InformationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INFORMATION_FIELDS } from "./constants";
import { useTransition } from "react";
import type { InformationSchema as InformationSchemaType } from "./validation";

const InformationForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: InformationSchemaType;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InformationSchemaType>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createInformation : updateInformation,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction(data);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Information has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add Information" : "Update Information"}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {INFORMATION_FIELDS.map(({ name, label, type }) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            {type === 'textarea' ? (
              <Textarea
                id={name}
                {...register(name as keyof InformationSchemaType)}
                defaultValue={data?.[name as keyof InformationSchemaType] || ''}
                aria-invalid={errors[name as keyof InformationSchemaType] ? "true" : "false"}
              />
            ) : (
              <Input
                id={name}
                type={type}
                {...register(name as keyof InformationSchemaType)}
                defaultValue={data?.[name as keyof InformationSchemaType] || ''}
                aria-invalid={errors[name as keyof InformationSchemaType] ? "true" : "false"}
              />
            )}
            {errors[name as keyof InformationSchemaType] && (
              <span className="text-sm text-red-500">
                {errors[name as keyof InformationSchemaType]?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 disabled:bg-neutral-400"
      >
        {isPending ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default InformationForm; 