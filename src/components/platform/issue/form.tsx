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
import { createIssue, updateIssue } from './action';
import EstTime from './esttime';
import { club, clubs } from "../repository/constant";
import SelectPopover from "@/components/atom/popover/popover";
import Indicator from '@/components/atom/modal/indicator';
import Status from '../repository/status';
import Priority from './priority';
import { getRepositories } from '../repository/action';
import { IssueType } from './type';
import { ErrorToast } from '@/components/atom/toast';

interface Props {
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  initialData?: IssueType | null;
  isEditing?: boolean;
}

interface Repository {
  id: string;
  title: string;
}

const IssueForm: React.FC<Props> = ({ onClose, onSuccess, initialData, isEditing = false }) => {
  const [step, setStep] = useState(1);
  const [selectedClub, setSelectedClub] = useState<club | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<{value: string, label: string} | null>(null);
  const [repositories, setRepositories] = useState<{value: string, label: string}[]>([]);
  const [, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up the form with initial values if editing
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      repository: initialData?.repository || '',
      issue: initialData?.issue || '',
      club: initialData?.club || '',
      status: (initialData?.status as any) || 'pending',
      priority: (initialData?.priority as any) || 'pending',
      duration: initialData?.duration || '',
      desc: initialData?.desc || '',
      label: initialData?.label || '',
      tag: initialData?.tag || '',
      remark: initialData?.remark || '',
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

  // Initialize form with initial data
  useEffect(() => {
    if (initialData && isEditing) {
      // Set form values
      form.reset({
        repository: initialData.repository || '',
        issue: initialData.issue || '',
        club: initialData.club || '',
        status: (initialData.status as any) || 'pending',
        priority: (initialData.priority as any) || 'pending',
        duration: initialData.duration || '',
        desc: initialData.desc || '',
        label: initialData.label || '',
        tag: initialData.tag || '',
        remark: initialData.remark || '',
      });

      // Set selected club
      if (initialData.club) {
        const matchedClub = clubs.find(c => c.value === initialData.club);
        if (matchedClub) {
          setSelectedClub(matchedClub);
        }
      }

      // Set selected repository
      if (initialData.repository && initialData.repositoryTitle) {
        setSelectedRepository({
          value: initialData.repository,
          label: initialData.repositoryTitle
        });
      }
    }
  }, [initialData, isEditing, form]);

  // Fetch repositories for dropdown
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const result = await getRepositories();
        if (result.repositories) {
          const formattedRepos = result.repositories.map(repo => ({
            value: repo.id,
            label: repo.title
          }));
          setRepositories(formattedRepos);
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
        toast.error('Failed to load repositories');
      }
    };
    
    fetchRepositories();
  }, []);

  const nextStep = () => setStep((prev) => (prev < 4 ? prev + 1 : 4));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  const handleValidSubmit = async (data: IssueFormValues) => {
    try {
      setIsSubmitting(true);
      // Add club from the selected value and repository from selected repository
      const formData = {
        ...data,
        repository: selectedRepository?.value || '',
        club: selectedClub?.value || '',
      };
      let result;
      if (isEditing && initialData?._id) {
        // Update existing issue
        result = await updateIssue(initialData._id, formData);
      } else {
        // Create new issue
        result = await createIssue(formData);
      }
      if (result.error) {
        ErrorToast(result.error);
        return;
      }
      toast.success(isEditing ? 'تم تحديث المشكلة بنجاح' : 'تم إنشاء المشكلة بنجاح');
      form.reset();
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (error: any) {
      ErrorToast(error.message || 'فشل في معالجة المشكلة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = (errors: any) => {
    const firstError = Object.values(errors)[0];
    if (firstError && typeof firstError === 'object' && 'message' in firstError) {
      ErrorToast((firstError as any).message);
    } else {
      ErrorToast('يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className='felx pl-[30rem] pb-4 flex-col items-start justify-start gap-2 -mt-10'>
        <h3>{isEditing ? 'تعديل المشكلة' : 'مشكلة جديدة'}</h3>
        <p className='text-sm font-light mt-2'>
          لا يتحرك المرء نحو واجهة, انما يتحرك ليصنع واحدة
        </p>
      </div>
      <Form<IssueFormValues> {...form}>
        <form
          onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
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
                render={() => (
                  <FormItem>
                    <FormControl>
                      <SelectPopover
                        items={repositories}
                        selectedItem={selectedRepository}
                        setSelectedItem={(item) => {
                          setSelectedRepository(item);
                          form.setValue("repository", item?.value ?? "");
                        }}
                        label="+ اختر المستودع"
                      />
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
            {isSubmitting 
              ? (isEditing ? "جارٍ التحديث..." : "جارٍ الإنشاء...") 
              : (isEditing ? "تحديث المشكلة" : "إنشاء المشكلة")
            }
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default IssueForm;
