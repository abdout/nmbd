'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { activitySchema, ActivitySchema } from "./validation";
import { useFormContext } from '@/components/onboarding/form-context';
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTIVITY_FIELDS, CLUB_TYPES } from "./constants";
import { submitActivityForm } from "./action";

interface ActivityFormProps {
  user: {
    id: string;
    partyMember?: boolean;
    partyName?: string | null;
    partyStartDate?: Date | null;
    partyEndDate?: Date | null;
    unionMember?: boolean;
    unionName?: string | null;
    unionStartDate?: Date | null;
    unionEndDate?: Date | null;
    ngoMember?: boolean;
    ngoName?: string | null;
    ngoActivity?: string | null;
    clubMember?: boolean;
    clubName?: string | null;
    clubType?: string | null;
  };
}

export default function ActivityForm({ user }: ActivityFormProps) {
  const { formRef, setIsSubmitting } = useFormContext();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      partyMember: user.partyMember || false,
      partyName: user.partyName || '',
      partyStartDate: user.partyStartDate?.toISOString().split('T')[0] || '',
      partyEndDate: user.partyEndDate?.toISOString().split('T')[0] || '',
      unionMember: user.unionMember || false,
      unionName: user.unionName || '',
      unionStartDate: user.unionStartDate?.toISOString().split('T')[0] || '',
      unionEndDate: user.unionEndDate?.toISOString().split('T')[0] || '',
      ngoMember: user.ngoMember || false,
      ngoName: user.ngoName || '',
      ngoActivity: user.ngoActivity || '',
      clubMember: user.clubMember || false,
      clubName: user.clubName || '',
      clubType: user.clubType || '',
    }
  });

  const watchPartyMember = watch('partyMember');
  const watchUnionMember = watch('unionMember');
  const watchNgoMember = watch('ngoMember');
  const watchClubMember = watch('clubMember');

  return (
    <form ref={formRef} action={(formData) => {
      setIsSubmitting(true);
      startTransition(() => {
        submitActivityForm(formData);
      });
      setIsSubmitting(false);
    }} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">النشاط السياسي</h3>
        {ACTIVITY_FIELDS.political.map((field) => (
          <div key={field.name} className={`space-y-2 ${field.conditional && !watchPartyMember ? 'hidden' : ''}`}>
            {field.type === 'toggle' ? (
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Switch
                  id={field.name}
                  {...register(field.name)}
                />
              </div>
            ) : (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">النشاط النقابي</h3>
        {ACTIVITY_FIELDS.union.map((field) => (
          <div key={field.name} className={`space-y-2 ${field.conditional && !watchUnionMember ? 'hidden' : ''}`}>
            {field.type === 'toggle' ? (
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Switch
                  id={field.name}
                  {...register(field.name)}
                />
              </div>
            ) : (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">النشاط الاجتماعي</h3>
        {ACTIVITY_FIELDS.social.map((field) => (
          <div key={field.name} className={`space-y-2 ${field.conditional && !watchNgoMember ? 'hidden' : ''}`}>
            {field.type === 'toggle' ? (
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Switch
                  id={field.name}
                  {...register(field.name)}
                />
              </div>
            ) : field.type === 'textarea' ? (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  id={field.name}
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            ) : (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">النشاط الشبابي</h3>
        {ACTIVITY_FIELDS.club.map((field) => (
          <div key={field.name} className={`space-y-2 ${field.conditional && !watchClubMember ? 'hidden' : ''}`}>
            {field.type === 'toggle' ? (
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Switch
                  id={field.name}
                  {...register(field.name)}
                />
              </div>
            ) : field.type === 'select' ? (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Select onValueChange={(value) => register(field.name).onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع النادي" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLUB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            ) : (
              <>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-sm text-red-500">
                    {errors[field.name]?.message}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </form>
  );
} 