"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "./validation";
import { login } from "./login-action";
import { FormError } from "./error/form-error";
import { FormSuccess } from "./form-success";
import { Social } from "./social";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "البريد الإلكتروني مستخدم بالفعل مع مزود آخر!"
    : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("حدث خطأ ما"));
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 min-w-[200px] md:min-w-[350px]", className)} {...props}>
      <Card className="border-none shadow-none">
        <CardHeader className="text-center">
          {/* <CardTitle className="text-xl">مرحبًا بعودتك</CardTitle>
          <CardDescription>
            تسجيل الدخول باستخدام حساب Apple أو Google
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Social />
        </CardContent>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  أو 
                </span>
              </div>
              
              <div className="grid gap-4">
                {showTwoFactor ? (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="رمز التحقق بخطوتين"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              id="email"
                              type="email"
                              disabled={isPending}
                              placeholder="البريد الإلكتروني"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              id="password"
                              type="password"
                              disabled={isPending}
                              placeholder="كلمة المرور"
                            />
                          </FormControl>
                          <Link
                            href="/auth/reset"
                            className="text-sm text-start hover:underline underline-offset-4"
                          >
                            نسيت كلمة المرور؟
                          </Link>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormError message={error || urlError} />
                <FormSuccess message={success} />
                
                <Button disabled={isPending} type="submit" className="w-full h-11 text-base">
                  {showTwoFactor ? "تأكيد" : "تسجيل الدخول"}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <Link href="/auth/join" className="hover:underline underline-offset-4">
                  ليس لديك حساب؟
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        بالنقر على متابعة، فإنك توافق على <br/> <a href="#">شروط الخدمة</a>{" "}
        و <a href="#">سياسة الخصوصية</a>.
      </div> */}
    </div>
  );
};
