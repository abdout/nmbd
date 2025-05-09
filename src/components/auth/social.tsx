"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

// Function to clean Facebook URL hash
const cleanUrlHash = () => {
  // Only run on client side
  if (typeof window !== "undefined") {
    // Check if URL has the Facebook hash fragment
    if (window.location.hash === "#_=_") {
      // Clean the hash
      const cleanUrl = window.location.href.replace(/#.*$/, "");
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
};

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  
  // Clean URL hash on component mount - this will handle Facebook redirects
  useEffect(() => {
    cleanUrlHash();
  }, []);

  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="lg"
        className="w-full items-center"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" width="14" height="14" className="mr-2">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        قوقل
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("facebook")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" className="mr-2">
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            fill="#1877F2"
          />
        </svg>
        فيسبوك
      </Button>
    </div>
  );
};
