"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notifyOnboardingSubmission } from "@/components/notifications/action";

export default function NotificationTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Test Applicant");
  const [email, setEmail] = useState("test@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [whatsapp, setWhatsapp] = useState("+1234567890");

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      addLog(`Sending notification for: ${name}`);
      
      // Generate a random ID to simulate a real user ID
      const applicantId = Math.random().toString(36).substring(2, 15);
      
      const result = await notifyOnboardingSubmission(
        name,
        applicantId,
        email,
        phone,
        whatsapp
      );
      
      addLog(`Notification result: ${JSON.stringify(result)}`);
      addLog("Check the following:");
      addLog("1. Server logs for WhatsApp notification simulation");
      addLog("2. The notification icon in the sidebar should show a badge");
      addLog("3. Database should have new notification entries for admin users");
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Notification System Test Lab</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Onboarding Notification</CardTitle>
            <CardDescription>
              Simulate a notification for a new onboarding submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Applicant Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input 
                  id="whatsapp" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleTest} 
              disabled={loading}
              className="mr-2"
            >
              {loading ? "Sending..." : "Send Test Notification"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Console Logs</CardTitle>
            <CardDescription>
              View test results and debug information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-slate-50 p-4 rounded-md h-[400px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-slate-400 italic">No logs yet. Run a test to see results.</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={clearLogs}
            >
              Clear Logs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 