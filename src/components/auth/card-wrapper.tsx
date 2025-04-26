"use client";

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";



interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  showHorizontalLine?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  showHorizontalLine = true
}: CardWrapperProps) => {
  return (
    <Card className="w-[350px] border-none shadow-none text-black">
       {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      {showHorizontalLine && <hr className="mx-7 pb-4 items-center justify-center" />}
      <CardHeader className={`${!showHorizontalLine ? 'mt-0' : '-mt-14'}`}>
       
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      
      <CardFooter className="text-black !important">
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
          className="text-foreground"
        />
      </CardFooter>
    </Card>
  );
};
