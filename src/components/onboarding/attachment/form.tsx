"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attachmentSchema, AttachmentSchema } from "./validation";
import { createAttachment, updateAttachment } from "./action";
import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ATTACHMENT_FIELDS } from "./constants";
import { useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const AttachmentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: AttachmentSchema;
}) => {
  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AttachmentSchema>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: data,
  });

  const formValues = watch();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createAttachment : updateAttachment,
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
      toast(`Files have been ${type === "create" ? "uploaded" : "updated"}!`);
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Upload Files" : "Update Files"}
      </h1>

      <div className="flex flex-row gap-6">
        {ATTACHMENT_FIELDS.map(({ name, label, type: fieldType }) => (
          <CldUploadWidget
            key={name}
            uploadPreset="social"
            options={fieldType === 'raw' ? { resourceType: "raw" } : undefined}
            onSuccess={(result: any, { widget }) => {
              if (result.info && 'secure_url' in result.info) {
                setValue(name, result.info.secure_url);
              }
              widget.close();
            }}
          >
            {({ open }: { open: () => void }) => (
              <div
                onClick={() => open()}
                className="relative flex items-center justify-center w-24 h-24 cursor-pointer overflow-hidden border border-neutral-500 rounded-lg hover:bg-neutral-100"
              >
                {formValues[name] ? (
                  fieldType === 'image' ? (
                    <Image
                      src={formValues[name] || ''}
                      alt={label}
                      width={96}
                      height={96}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-700 text-sm">
                      <span>File Uploaded</span>
                      <br />
                      <span className="text-xs">(Click to change)</span>
                    </div>
                  )
                ) : (
                  <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                    {label}
                  </span>
                )}
              </div>
            )}
          </CldUploadWidget>
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
        {isPending ? "Saving..." : type === "create" ? "Upload" : "Update"}
      </button>
    </form>
  );
};

export default AttachmentForm; 