'use client';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const errorMessages: Record<string, string> = {
    Configuration: "هناك مشكلة في إعدادات الخادم.",
    AccessDenied: "ليس لديك إذن لتسجيل الدخول.",
    Verification: "ربما انتهت صلاحية رابط التحقق أو تم استخدامه بالفعل.",
    OAuthSignin: "تعذر بدء تسجيل الدخول باستخدام مزود المصادقة.",
    OAuthCallback: "حدث خطأ أثناء إكمال تسجيل الدخول.",
    OAuthCreateAccount: "تعذر إنشاء مستخدم في قاعدة البيانات.",
    EmailCreateAccount: "تعذر إنشاء مستخدم البريد الإلكتروني في قاعدة البيانات.",
    Callback: "حدث خطأ ما في استجابة المصادقة.",
    OAuthAccountNotLinked: "هذا البريد الإلكتروني مرتبط بالفعل بحساب آخر.",
    EmailSignin: "تعذر إرسال البريد الإلكتروني.",
    CredentialsSignin: "بيانات الاعتماد التي قدمتها غير صالحة.",
    SessionRequired: "يجب أن تكون مسجل الدخول للوصول إلى هذه الصفحة.",
    default: "حدث خطأ غير متوقع."
  };
  
  const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.default;

  return (
    <CardWrapper
      headerLabel="خطأ في المصادقة"
      backButtonHref="/login"
      backButtonLabel="العودة إلى تسجيل الدخول"
    >
      <div className="w-full flex flex-col items-center gap-4">
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <p>{errorMessage}</p>
        </div>
        {error && (
          <div className="text-xs text-muted-foreground text-center">
            <p>رمز الخطأ: {error}</p>
            <p className="mt-2">إذا استمرت هذه المشكلة، يرجى الاتصال بالدعم.</p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};
