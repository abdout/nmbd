"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifyOnboardingSubmission } from "@/components/notifications/action";
import { sendWhatsAppNotification } from "@/components/notifications/whatsapp";
import { sendTelegramNotification, sendChannelNotification, validateBotToken } from "@/components/notifications/telegram";

export default function NotificationTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Test Applicant");
  const [email, setEmail] = useState("test@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [whatsapp, setWhatsapp] = useState("+1234567890");
  
  // WhatsApp direct test
  const [waMessage, setWaMessage] = useState("Test message from lab");
  const [waRecipient, setWaRecipient] = useState("");
  
  // Telegram direct test
  const [tgMessage, setTgMessage] = useState("Test message from lab");
  const [tgChatId, setTgChatId] = useState("");
  const [tgChannel, setTgChannel] = useState("");
  const [tgBotToken, setTgBotToken] = useState("");
  const [tgBotInfo, setTgBotInfo] = useState<any>(null);
  
  const [envVars, setEnvVars] = useState<{[key: string]: string | undefined}>({});

  useEffect(() => {
    // Fetch environment variables for debugging
    const fetchEnvVars = async () => {
      try {
        addLog("Fetching environment configuration...");
        // This is intentionally not using actual env vars for security
        // Just checking if they're defined
        setEnvVars({
          NODE_ENV: process.env.NODE_ENV,
          WHATSAPP_ENABLED: process.env.WHATSAPP_NOTIFICATIONS_ENABLED ? "defined" : "undefined",
          SECRETARY_WHATSAPP: process.env.MEMBERSHIP_SECRETARY_WHATSAPP ? "defined" : "undefined",
          TELEGRAM_ENABLED: process.env.TELEGRAM_NOTIFICATIONS_ENABLED ? "defined" : "undefined",
          TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "defined" : "undefined",
          TELEGRAM_CHAT_ID: process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID ? "defined" : "undefined",
          TELEGRAM_CHANNEL: process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL ? "defined" : "undefined",
        });
        
        if (process.env.MEMBERSHIP_SECRETARY_WHATSAPP) {
          setWaRecipient(process.env.MEMBERSHIP_SECRETARY_WHATSAPP);
          addLog(`Default WhatsApp recipient loaded`);
        } else {
          addLog("⚠️ No default WhatsApp recipient configured");
        }
        
        if (process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID) {
          setTgChatId(process.env.MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID);
          addLog(`Default Telegram chat ID loaded`);
        }
        
        if (process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL) {
          setTgChannel(process.env.MEMBERSHIP_NOTIFICATIONS_CHANNEL);
          addLog(`Default Telegram channel loaded`);
        }
        
        // Check if Telegram bot is valid
        if (process.env.TELEGRAM_BOT_TOKEN) {
          try {
            const validation = await validateBotToken(process.env.TELEGRAM_BOT_TOKEN);
            if (validation.valid && validation.botInfo) {
              setTgBotInfo(validation.botInfo);
              addLog(`✅ Telegram bot validated: @${validation.botInfo.username}`);
            } else {
              addLog(`❌ Telegram bot token invalid: ${validation.error || 'Unknown error'}`);
            }
          } catch (error) {
            addLog(`Error validating Telegram bot: ${error}`);
          }
        }
        
      } catch (error) {
        addLog(`Error fetching config: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    fetchEnvVars();
  }, []);

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
      addLog("1. Server logs for external notification attempts");
      addLog("2. The notification icon in the sidebar should show a badge");
      addLog("3. Database should have new notification entries for admin users");
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsAppTest = async () => {
    try {
      setLoading(true);
      addLog(`Sending direct WhatsApp message to: ${waRecipient}`);
      
      const result = await sendWhatsAppNotification({
        to: waRecipient,
        message: waMessage
      });
      
      addLog(`Direct WhatsApp result: ${JSON.stringify(result)}`);
      if (process.env.NODE_ENV === "development") {
        addLog("⚠️ In development mode, WhatsApp messages are only logged, not actually sent");
      } else {
        addLog("Note: Check server logs for WhatsApp send attempt details");
      }
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectTelegramTest = async () => {
    try {
      setLoading(true);
      
      if (!tgChatId && !tgChannel) {
        addLog("⚠️ Please enter either a Chat ID or Channel name");
        setLoading(false);
        return;
      }
      
      if (tgChatId) {
        addLog(`Sending direct Telegram message to chat ID: ${tgChatId}`);
        
        const result = await sendTelegramNotification({
          chatId: tgChatId,
          message: tgMessage
        });
        
        addLog(`Direct Telegram result (chat): ${JSON.stringify(result)}`);
      }
      
      if (tgChannel) {
        addLog(`Sending direct Telegram message to channel: ${tgChannel}`);
        
        const result = await sendChannelNotification(tgMessage, tgChannel);
        
        addLog(`Direct Telegram result (channel): ${JSON.stringify(result)}`);
      }
      
      if (process.env.NODE_ENV === "development" && process.env.TELEGRAM_DEV_MODE_ONLY_LOG === "true") {
        addLog("⚠️ In development mode with TELEGRAM_DEV_MODE_ONLY_LOG=true, messages are only logged, not actually sent");
      }
      
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleValidateBotToken = async () => {
    if (!tgBotToken) {
      addLog("⚠️ Please enter a bot token to validate");
      return;
    }
    
    try {
      setLoading(true);
      addLog(`Validating Telegram bot token...`);
      
      const validation = await validateBotToken(tgBotToken);
      
      if (validation.valid && validation.botInfo) {
        setTgBotInfo(validation.botInfo);
        addLog(`✅ Bot token is valid!`);
        addLog(`Bot username: @${validation.botInfo.username}`);
        addLog(`Bot name: ${validation.botInfo.firstName}`);
      } else {
        setTgBotInfo(null);
        addLog(`❌ Invalid bot token: ${validation.error || 'Unknown error'}`);
      }
    } catch (error) {
      addLog(`Error validating bot token: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Notification System Test Lab</h1>
      
      <Tabs defaultValue="notification">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-6 w-full md:w-auto justify-start space-x-2">
            <TabsTrigger value="notification" className="min-w-[140px] px-4">Notification Test</TabsTrigger>
            <TabsTrigger value="whatsapp" className="min-w-[140px] px-4">WhatsApp Debug</TabsTrigger>
            <TabsTrigger value="telegram" className="min-w-[140px] px-4">Telegram Debug</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="notification">
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
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
                <CardDescription>
                  Debug WhatsApp notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded bg-slate-100 p-4 text-sm">
                    <h3 className="font-semibold mb-2">Environment Variables</h3>
                    <div className="space-y-1">
                      <div><span className="font-medium">NODE_ENV:</span> {envVars.NODE_ENV || 'Not defined'}</div>
                      <div><span className="font-medium">WHATSAPP_NOTIFICATIONS_ENABLED:</span> {envVars.WHATSAPP_ENABLED}</div>
                      <div><span className="font-medium">MEMBERSHIP_SECRETARY_WHATSAPP:</span> {envVars.SECRETARY_WHATSAPP}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Direct WhatsApp Test</h3>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="waRecipient">Recipient Number</Label>
                      <Input 
                        id="waRecipient" 
                        value={waRecipient} 
                        onChange={(e) => setWaRecipient(e.target.value)} 
                        placeholder="E.g. +1234567890"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="waMessage">Message</Label>
                      <Input 
                        id="waMessage" 
                        value={waMessage} 
                        onChange={(e) => setWaMessage(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleDirectWhatsAppTest} 
                  disabled={loading || !waRecipient}
                >
                  {loading ? "Sending..." : "Test WhatsApp Directly"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration Notes</CardTitle>
                <CardDescription>
                  How to properly configure WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Current Implementation</h3>
                    <p className="mb-2">The current WhatsApp implementation is a placeholder. In production:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Messages are logged but not actually sent</li>
                      <li>You need to integrate with a WhatsApp API provider</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Recommended Setup</h3>
                    <p className="mb-2">To send real WhatsApp messages:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Sign up for a service like Twilio or MessageBird</li>
                      <li>Get API credentials and a WhatsApp sender number</li>
                      <li>Update the <code>whatsapp.ts</code> file with your provider's API code</li>
                      <li>Set the required environment variables</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Required Env Variables</h3>
                    <pre className="bg-slate-100 p-2 rounded">
                      WHATSAPP_NOTIFICATIONS_ENABLED=true
                      MEMBERSHIP_SECRETARY_WHATSAPP=+1234567890
                      
                      # Plus provider-specific variables like:
                      # TWILIO_ACCOUNT_SID=xxxxx
                      # TWILIO_AUTH_TOKEN=xxxxx
                      # TWILIO_WHATSAPP_NUMBER=+1234567890
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="telegram">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Telegram Configuration</CardTitle>
                <CardDescription>
                  Debug Telegram notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded bg-slate-100 p-4 text-sm">
                    <h3 className="font-semibold mb-2">Environment Variables</h3>
                    <div className="space-y-1">
                      <div><span className="font-medium">NODE_ENV:</span> {envVars.NODE_ENV || 'Not defined'}</div>
                      <div><span className="font-medium">TELEGRAM_NOTIFICATIONS_ENABLED:</span> {envVars.TELEGRAM_ENABLED}</div>
                      <div><span className="font-medium">TELEGRAM_BOT_TOKEN:</span> {envVars.TELEGRAM_BOT_TOKEN}</div>
                      <div><span className="font-medium">MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID:</span> {envVars.TELEGRAM_CHAT_ID}</div>
                      <div><span className="font-medium">MEMBERSHIP_NOTIFICATIONS_CHANNEL:</span> {envVars.TELEGRAM_CHANNEL}</div>
                    </div>
                  </div>
                  
                  {tgBotInfo && (
                    <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
                      <h3 className="font-semibold mb-2 text-green-700">Connected Bot</h3>
                      <div className="space-y-1 text-green-800">
                        <div><span className="font-medium">Username:</span> @{tgBotInfo.username}</div>
                        <div><span className="font-medium">Name:</span> {tgBotInfo.firstName}</div>
                        <div><span className="font-medium">ID:</span> {tgBotInfo.id}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Bot Token Validator</h3>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="tgBotToken">Bot Token</Label>
                      <Input 
                        id="tgBotToken" 
                        value={tgBotToken} 
                        onChange={(e) => setTgBotToken(e.target.value)} 
                        placeholder="1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleValidateBotToken}
                        disabled={loading || !tgBotToken}
                        size="sm"
                      >
                        Validate Bot Token
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Direct Telegram Test</h3>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="tgChatId">Chat ID (individual/group chat)</Label>
                      <Input 
                        id="tgChatId" 
                        value={tgChatId} 
                        onChange={(e) => setTgChatId(e.target.value)} 
                        placeholder="E.g. 123456789"
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="tgChannel">Channel Name (with @ prefix)</Label>
                      <Input 
                        id="tgChannel" 
                        value={tgChannel} 
                        onChange={(e) => setTgChannel(e.target.value)} 
                        placeholder="E.g. @my_channel"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tgMessage">Message</Label>
                      <Input 
                        id="tgMessage" 
                        value={tgMessage} 
                        onChange={(e) => setTgMessage(e.target.value)} 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        HTML formatting supported: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;a href="..."&gt;link&lt;/a&gt;
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleDirectTelegramTest} 
                  disabled={loading || (!tgChatId && !tgChannel)}
                >
                  {loading ? "Sending..." : "Test Telegram Directly"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Telegram Integration Notes</CardTitle>
                <CardDescription>
                  How to properly configure Telegram
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Current Implementation</h3>
                    <p className="mb-2">The Telegram implementation uses the official Telegram Bot API:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No third-party service required - direct API access</li>
                      <li>Free to use with no message limits</li>
                      <li>HTML formatting supported</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Recommended Setup</h3>
                    <p className="mb-2">To set up Telegram notifications:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Chat with @BotFather on Telegram to create a new bot</li>
                      <li>Get your bot token from BotFather</li>
                      <li>Start a chat with your bot and send a message</li>
                      <li>Visit the URL: <code>https://api.telegram.org/bot&lt;YOUR_TOKEN&gt;/getUpdates</code></li>
                      <li>Find your chat_id in the response JSON</li>
                      <li>Set the required environment variables</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Required Env Variables</h3>
                    <pre className="bg-slate-100 p-2 rounded">
                      TELEGRAM_NOTIFICATIONS_ENABLED=true
                      TELEGRAM_BOT_TOKEN=1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ
                      MEMBERSHIP_SECRETARY_TELEGRAM_CHAT_ID=123456789
                      
                      # Optional channel for broadcasting
                      MEMBERSHIP_NOTIFICATIONS_CHANNEL=@my_channel
                      
                      # Optional dev-mode flag
                      TELEGRAM_DEV_MODE_ONLY_LOG=true
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Advantages Over WhatsApp</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><span className="font-medium">Free:</span> No costs or quotas</li>
                      <li><span className="font-medium">Easy Setup:</span> No approval process or waiting</li>
                      <li><span className="font-medium">Rich Features:</span> HTML formatting, buttons (future)</li>
                      <li><span className="font-medium">Privacy:</span> No phone number sharing required</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 