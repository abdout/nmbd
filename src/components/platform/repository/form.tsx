import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import SelectPopover from "@/components/atom/popover/popover";
import { club, clubs } from "./constant";
import Status from "./status";
import { Icon } from "@iconify/react";
import Indicator from "@/components/atom/modal/indicator";
import { createRepository, updateRepository } from "./action";
import { SuccessToast, ErrorToast } from '@/components/atom/toast';
import { Repository } from './type';

export type StatusType = "pending" | "stuck" | "in_progress" | "done";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  club: z.string().min(1, "Club is required"),
  status: z.string().min(1, "Status is required"),
  readme: z.string(),
  roadmap: z.string(),
  contributor: z.string(),
  material: z.string(),
  chat: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  onClose: () => void;
  repositoryToEdit?: Repository;
}

const RepositoryForm: React.FC<Props> = ({ onClose, repositoryToEdit }) => {
  const [step, setStep] = useState(1);
  const [selectedClub, setSelectedClub] = useState<club | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => setStep(prevStep => (prevStep < 4 ? prevStep + 1 : 4));
  const prevStep = () => setStep(prevStep => (prevStep > 1 ? prevStep - 1 : 1));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: repositoryToEdit ? {
      title: repositoryToEdit.title || "",
      desc: repositoryToEdit.desc || "",
      club: repositoryToEdit.club || "",
      status: repositoryToEdit.status || "pending",
      readme: repositoryToEdit.readme || "",
      roadmap: repositoryToEdit.roadmap || "",
      contributor: repositoryToEdit.contributor || "",
      material: repositoryToEdit.material || "",
      chat: repositoryToEdit.chat || "",
    } : {
      title: "",
      desc: "",
      club: "",
      status: "pending",
      readme: "",
      roadmap: "",
      contributor: "",
      material: "",
      chat: "",
    },
    mode: 'onSubmit',
  });

  // Reset form when repositoryToEdit changes
  useEffect(() => {
    if (repositoryToEdit) {
      form.reset({
        title: repositoryToEdit.title || "",
        desc: repositoryToEdit.desc || "",
        club: repositoryToEdit.club || "",
        status: repositoryToEdit.status || "pending",
        readme: repositoryToEdit.readme || "",
        roadmap: repositoryToEdit.roadmap || "",
        contributor: repositoryToEdit.contributor || "",
        material: repositoryToEdit.material || "",
        chat: repositoryToEdit.chat || "",
      });
      setSelectedClub(clubs.find(c => c.value === repositoryToEdit.club) || null);
    } else {
      form.reset({
        title: "",
        desc: "",
        club: "",
        status: "pending",
        readme: "",
        roadmap: "",
        contributor: "",
        material: "",
        chat: "",
      });
      setSelectedClub(null);
    }
  }, [repositoryToEdit]);

  // Determine if we are editing
  const isEdit = Boolean(repositoryToEdit?.id);

  const handleSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const formData = {
        ...data,
        club: selectedClub?.value || data.club,
      };
      let result;
      if (repositoryToEdit?.id) {
        result = await updateRepository(repositoryToEdit.id, formData);
      } else {
        result = await createRepository(formData);
      }
      if (result.repository) {
        SuccessToast();
        form.reset();
        setSelectedClub(null);
        onClose();
      }
    } catch (error) {
      console.error("Error saving repository:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit, (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError && firstError.message) {
        let msg = firstError.message;
        if (msg.includes('Title')) msg = 'يرجى إدخال اسم المستودع';
        else if (msg.includes('Description')) msg = 'يرجى إدخال وصف المستودع';
        else if (msg.includes('Club')) msg = 'يرجى اختيار الأمانة';
        else if (msg.includes('Status')) msg = 'يرجى اختيار حالة المستودع';
        ErrorToast(msg);
      } else {
        ErrorToast("يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح");
      }
    })(e);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className='flex pl-[30rem] pb-4 flex-col items-start justify-start gap-2 -mt-10'>
        <h3>{isEdit ? "تعديل المستودع" : "مستودع جديد"}</h3>
        <p className='text-sm font-light mt-2'>
          الجزء الاكثر سحرا في كتب هاري بورتر, انهم في الاخير <br/> استعملوا المهارات التي تعلموها في المدرسة
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md flex flex-col justify-center items-center gap-6 -mt-40 relative h-full"
        >
          <Button
            type='button'
            size="icon"
            variant='outline'
            className={`absolute top-1/2 left-[-10rem] transform -translate-y-1/2 rounded-full ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={prevStep}
            disabled={isLoading}
          >
            <Icon icon="ic:sharp-arrow-back" width={25} />
          </Button>
          <Button
            type='button'
            size="icon"
            variant='outline'
            className={`absolute top-1/2 right-[-10rem] transform -translate-y-1/2 rounded-full ${step === 4 ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={nextStep}
            disabled={isLoading}
          >
            <Icon icon="ic:sharp-arrow-forward" width={25} />
          </Button>
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="w-72" placeholder="الاسم" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-20 w-72" placeholder="الوصف" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
          {step === 2 && (
            <FormField
              control={form.control}
              name="club"
              render={() => (
                <FormItem>
                  <FormControl>
                    <SelectPopover
                      items={clubs}
                      selectedItem={selectedClub}
                      setSelectedItem={(item) => {
                        setSelectedClub(item);
                        form.setValue("club", item?.value ?? "");
                      }}
                      label="+ الامانة"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {step === 3 && (
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Status
                      status={form.watch("status") as StatusType}
                      setStatus={(status) => form.setValue("status", status)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {step === 4 && (
            <>
              <FormField
                control={form.control}
                name="readme"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="w-72" placeholder="README" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roadmap"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="w-72" placeholder="Roadmap" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          <div dir="ltr" className="absolute bottom-28">
            <Indicator totalSteps={4} currentStep={step} />
          </div>
          
          <Button
            type="submit"
            className="absolute bottom-10 mt-6 h-12 font-medium text-sm w-72"
            disabled={isLoading}
          >
            {isLoading
              ? (isEdit ? "جاري التعديل..." : "جاري الإنشاء...")
              : (isEdit ? "تعديل المستودع" : "انشاء المستودع")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RepositoryForm;
