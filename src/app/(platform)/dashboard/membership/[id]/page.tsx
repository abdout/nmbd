"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUserForLabReview, approveUserApplication, rejectUserApplication, type UserReviewData } from "@/components/onboarding/review/backup-action";
import {  ReviewContainer } from "@/components/membership/review-container";
import Loading from "@/components/atom/loading";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function LabUserReviewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const [userData, setUserData] = useState<UserReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchUserForLabReview(userId);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setUserData(result.data);
        }
      } catch (error) {
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) loadUserData();
  }, [userId]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveUserApplication(userId);
      if (result.success) {
        setSuccess(true);
        setUserData((prev: UserReviewData | null) => prev ? { ...prev, applicationStatus: "APPROVED" } : prev);
      } else {
        setError(result.error || "حدث خطأ أثناء الموافقة على الطلب");
      }
    } catch (error) {
      setError("حدث خطأ أثناء الموافقة على الطلب");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const result = await rejectUserApplication(userId);
      if (result.success) {
        setUserData((prev: UserReviewData | null) => prev ? { ...prev, applicationStatus: "REJECTED" } : prev);
      } else {
        setError(result.error || "حدث خطأ أثناء رفض الطلب");
      }
    } catch (error) {
      setError("حدث خطأ أثناء رفض الطلب");
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) return <Loading />;
//   if (error) return <ErrorState error={error} />;

  return (
    <div className="relative py-24">
      {/* Back arrow icon button in the top corner */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-6 right-9 z-10 rounded-full"
        onClick={() => router.back()}
        aria-label="رجوع"
      >
        <ArrowRight className="w-6 h-6" />
      </Button>
      
      <ReviewContainer userData={userData} isSubmitting={false} handleSubmit={async () => {}} />
      
      {/* Action buttons at the bottom
      {userData && userData.applicationStatus !== "APPROVED" && userData.applicationStatus !== "REJECTED" && (
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={handleApprove} 
            disabled={isApproving}
            variant="default"
            className="px-8"
          >
            {isApproving ? "جاري الموافقة..." : "موافقة"}
          </Button>
          <Button 
            onClick={handleReject} 
            disabled={isRejecting}
            variant="destructive"
            className="px-8"
          >
            {isRejecting ? "جاري الرفض..." : "رفض"}
          </Button>
        </div>
      )}

      {userData && userData.applicationStatus === "APPROVED" && (
        <div className="text-center mt-8 p-4 bg-green-100 rounded-md">
          <p className="text-green-800 font-bold">تمت الموافقة على الطلب</p>
        </div>
      )}

      {userData && userData.applicationStatus === "REJECTED" && (
        <div className="text-center mt-8 p-4 bg-red-100 rounded-md">
          <p className="text-red-800 font-bold">تم رفض الطلب</p>
        </div>
      )}
      
      {error && (
        <div className="text-center mt-8 p-4 bg-red-100 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )} */}
    </div>
  );
}
