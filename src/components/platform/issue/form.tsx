'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@iconify/react';

import { issueFormSchema, IssueFormValues, ISSUE_STATUS, ISSUE_PRIORITY } from './validation';
import { createIssue } from './action';
import EstTime from './esttime';
import { club, clubs } from "../repository/constant";
import SelectPopover from "@/components/atom/popover/popover";
import Indicator from '@/components/atom/modal/indicator';
import Status from '../repository/status';
import Priority from './priority';

interface Props {
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

const IssueForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedClub, setSelectedClub] = useState<club | null>(null);
  const [, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      repository: '',
      issue: '',
      club: '',
      status: 'pending',
      priority: 'pending',
      duration: '',
      desc: '',
      label: '',
      tag: '',
      remark: '',
    },
  });

  useEffect(() => {
    const calculatedProgress = (step / 4) * 100;
    setProgress(calculatedProgress);
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      // document.body.style.overflow = '';
    };
  }, []);

  const nextStep = () => setStep((prev) => (prev < 4 ? prev + 1 : 4));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  const onSubmit = async (data: IssueFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Form data:', data);
      
      // Add club from the selected value
      const formData = {
        ...data,
        club: selectedClub?.value || '',
      };
      
      const result = await createIssue(formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success('تم إنشاء المشكلة بنجاح');
      form.reset();
      
      if (onSuccess) {
        await onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error creating issue:', error);
      toast.error(error.message || 'فشل في إنشاء المشكلة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className='felx pl-[30rem] pb-4 flex-col items-start justify-start gap-2 -mt-10'>
        <h3>مشكلة جديدة</h3>
        <p className='text-sm font-light mt-2'>
          لا يتحرك المرء نحو واجهة, انما يتحرك ليصنع واحدة
        </p>
      </div>
      <Form<IssueFormValues> {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md flex flex-col justify-center items-center gap-6 -mt-40 relative h-full"
        >
          <Button
            type='button'
            size="icon"
            variant='outline'
            className={`absolute top-1/2 left-[-10rem] transform -translate-y-1/2 rounded-full ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={prevStep}
          >
            <Icon icon="ic:sharp-arrow-back" width={25} />
          </Button>
          <Button
            type='button'
            size="icon"
            variant='outline'
            className={`absolute top-1/2 right-[-10rem] transform -translate-y-1/2 rounded-full ${step === 4 ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={nextStep}
          >
            <Icon icon="ic:sharp-arrow-forward" width={25} />
          </Button>
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="issue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='w-72'
                        placeholder="العنوان" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='h-20 w-72'
                        placeholder="الوصف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="repository"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='w-72'
                        placeholder="المستودع" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <EstTime
                        value={field.value}
                        onChange={(value) => form.setValue("duration", value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 3 && (
            <>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 4 && (
            <>
              <div className="flex flex-row justify-between w-full">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1 mr-4">
                      <FormControl>
                        <Status
                          status={field.value as "pending" | "stuck" | "in_progress" | "done"}
                          setStatus={(status) => form.setValue("status", status as "pending" | "stuck" | "in_progress" | "done")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={() => (
                    <FormItem className="flex-1 ml-4">
                      <FormControl>
                        <Priority
                          priority={form.watch("priority") as "pending" | "high" | "medium" | "low"}
                          setPriority={(priority) => form.setValue("priority", priority as "pending" | "high" | "medium" | "low")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <div dir="ltr" className="absolute bottom-28">
            <Indicator totalSteps={4} currentStep={step} />
          </div>
          <Button
            type="submit"
            className="absolute bottom-10 mt-6 h-12 font-medium text-sm w-72"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء المشكلة"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default IssueForm;
