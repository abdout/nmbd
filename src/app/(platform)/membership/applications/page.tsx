'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle, Clock, Calendar, User, Mail, Phone } from "lucide-react";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { fetchPendingApplications, approveApplication, rejectApplication } from './actions';

// Define Application type
type Application = {
  id: string;
  name: string;
  fullname: string;
  email: string;
  phone: string;
  image: string | null;
  createdAt: Date;
  onboardingStatus: string | null;
  applicationStatus?: string | null;
};

// Type for raw data from the API
type RawApplication = {
  id: string;
  name: string | null;
  fullname: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  onboardingStatus: string | null;
  applicationStatus?: string | null;
  [key: string]: any; // Allow for additional fields
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPendingApplications() as RawApplication[];
        // Add default applicationStatus if missing
        const processedData = data.map(app => ({
          id: app.id,
          name: app.name || '',
          fullname: app.fullname || '',
          email: app.email || '',
          phone: app.phone || '',
          image: app.image,
          createdAt: app.createdAt,
          onboardingStatus: app.onboardingStatus || 'PENDING',
          applicationStatus: app.applicationStatus || 'PENDING'
        } as Application));
        setApplications(processedData);
        filterApplications(processedData, 'pending');
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  const filterApplications = (apps: Application[], status: string) => {
    if (status === 'pending') {
      setFilteredApplications(apps.filter(app => 
        app.applicationStatus === 'PENDING' || !app.applicationStatus
      ));
    } else if (status === 'approved') {
      setFilteredApplications(apps.filter(app => app.applicationStatus === 'APPROVED'));
    } else if (status === 'rejected') {
      setFilteredApplications(apps.filter(app => app.applicationStatus === 'REJECTED'));
    } else {
      setFilteredApplications(apps);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterApplications(applications, value);
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setReviewNotes('');
    setShowDialog(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    try {
      await approveApplication(selectedApplication.id, reviewNotes);
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, applicationStatus: 'APPROVED' } 
          : app
      );
      
      setApplications(updatedApplications);
      filterApplications(updatedApplications, activeTab);
      setShowDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    try {
      await rejectApplication(selectedApplication.id, reviewNotes);
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, applicationStatus: 'REJECTED' } 
          : app
      );
      
      setApplications(updatedApplications);
      filterApplications(updatedApplications, activeTab);
      setShowDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (status === 'APPROVED') {
      return <Badge variant="default" className="bg-green-500">Approved</Badge>;
    } else if (status === 'REJECTED') {
      return <Badge variant="default" className="bg-red-500">Rejected</Badge>;
    } else {
      return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">طلبات العضوية</h1>
          <p className="text-muted-foreground">مراجعة واعتماد طلبات العضوية الجديدة</p>
        </div>
      </div>

      <Tabs defaultValue="pending" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">قيد المراجعة</TabsTrigger>
          <TabsTrigger value="approved">تمت الموافقة</TabsTrigger>
          <TabsTrigger value="rejected">مرفوض</TabsTrigger>
          <TabsTrigger value="all">الكل</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground text-center">لا توجد طلبات {activeTab === 'pending' ? 'قيد المراجعة' : activeTab === 'approved' ? 'تمت الموافقة عليها' : 'مرفوضة'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{application.fullname || application.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" /> {application.email}
                        </CardDescription>
                        {application.phone && (
                          <CardDescription className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" /> {application.phone}
                          </CardDescription>
                        )}
                      </div>
                      {getStatusBadge(application.applicationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>تاريخ التقديم: {format(new Date(application.createdAt), 'PPP', { locale: ar })}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleViewApplication(application)}
                    >
                      عرض التفاصيل
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">مراجعة طلب العضوية</DialogTitle>
            <DialogDescription>
              مراجعة وتقييم طلب العضوية المقدم من {selectedApplication?.fullname || selectedApplication?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">الاسم الكامل</p>
                <p className="text-sm">{selectedApplication?.fullname || selectedApplication?.name || 'غير متوفر'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">البريد الإلكتروني</p>
                <p className="text-sm">{selectedApplication?.email || 'غير متوفر'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">رقم الهاتف</p>
                <p className="text-sm">{selectedApplication?.phone || 'غير متوفر'}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">تاريخ التقديم</p>
                <p className="text-sm">
                  {selectedApplication?.createdAt 
                    ? format(new Date(selectedApplication.createdAt), 'PPP', { locale: ar })
                    : 'غير متوفر'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-1">ملاحظات المراجعة</p>
              <Textarea
                placeholder="أضف ملاحظات عن هذا الطلب (اختياري)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 hover:text-blue-800"
                onClick={() => router.push(`/profile/${selectedApplication?.id}`)}
              >
                عرض الملف الشخصي الكامل
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-row sm:justify-end">
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              رفض
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              موافقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 