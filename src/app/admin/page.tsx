'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { assignRole } from './actions';
import { toast } from 'sonner';

const roleFormSchema = z.object({
  email: z.string().email({
    message: 'يرجى إدخال بريد إلكتروني صحيح.',
  }),
  role: z.enum(['ADMIN', 'USER', 'MEMBERSHIP_SECRETARY'], {
    required_error: 'يرجى اختيار دور.',
  }),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export default function AssignRolePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Initialize form
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      email: '',
      role: 'USER',
    },
  });

  async function onSubmit(data: RoleFormValues) {
    setIsSubmitting(true);
    try {
      const result = await assignRole(data);
      
      if (result.success) {
        toast.success('تم تعيين الدور بنجاح');
        form.reset();
      } else {
        toast.error(result.error || 'حدث خطأ أثناء تعيين الدور');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('حدث خطأ أثناء تعيين الدور');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>تعيين دور للمستخدم</CardTitle>
          <CardDescription>تعيين أو تغيير دور لمستخدم موجود من خلال البريد الإلكتروني</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="البريد الإلكتروني للمستخدم" {...field} />
                    </FormControl>
                    <FormDescription>
                      أدخل البريد الإلكتروني للمستخدم الذي تريد تعيين دور له.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدور</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر دوراً" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">مستخدم عادي</SelectItem>
                        <SelectItem value="MEMBERSHIP_SECRETARY">أمين العضوية</SelectItem>
                        <SelectItem value="ADMIN">مدير النظام</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      حدد الدور الذي تريد تعيينه للمستخدم.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التعيين...
                  </>
                ) : (
                  'تعيين الدور'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 