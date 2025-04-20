'use client';

import { useEffect, useState } from 'react';
import ClientFeed from "@/components/platform/x/feed/client-feed";
import Link from "next/link";

export default function FeedDebugPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [manualUserIdInput, setManualUserIdInput] = useState('');
  const [activeUserId, setActiveUserId] = useState<string | undefined>(undefined);
  const [feedRefreshes, setFeedRefreshes] = useState(0);
  
  // Check database status on load
  useEffect(() => {
    checkDatabase();
    
    // Listen for feed refreshes
    const intervalId = setInterval(() => {
      if (window._feedDebugInfo) {
        setFeedRefreshes(window._feedDebugInfo.refreshCount || 0);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to check database
  const checkDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/db-check');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setDbStatus(data);
      
      // If authenticated, use the user ID from the session
      if (data.isAuthenticated && data.userId) {
        setActiveUserId(data.userId);
      }
    } catch (err) {
      console.error('Error checking database:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to force refresh feed
  const forceRefreshFeed = () => {
    if (typeof window !== 'undefined' && window.forceRefreshFeed) {
      window.forceRefreshFeed();
    }
  };
  
  // Apply manual user ID
  const applyManualUserId = () => {
    if (manualUserIdInput.trim()) {
      setActiveUserId(manualUserIdInput.trim());
    } else {
      setActiveUserId(undefined);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Feed Debug</h1>
        <div>
          <Link href="/debug" className="text-blue-500 hover:underline mr-4">
            Back to Debug
          </Link>
          <Link href="/" className="text-blue-500 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  Feed Instance {feedRefreshes > 0 ? `(Refreshed ${feedRefreshes} times)` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {activeUserId ? `Viewing as User: ${activeUserId}` : 'Viewing global feed (no user filter)'}
                </p>
              </div>
              <button 
                onClick={forceRefreshFeed}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Refresh Feed
              </button>
            </div>
            
            <div className="mt-4 border rounded-lg overflow-hidden">
              <ClientFeed userId={activeUserId} />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-medium mb-4">Feed Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User ID Filter</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={manualUserIdInput}
                    onChange={(e) => setManualUserIdInput(e.target.value)}
                    placeholder="Enter user ID to filter"
                    className="flex-1 p-2 text-sm border rounded"
                  />
                  <button
                    onClick={applyManualUserId}
                    className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to see all posts, or enter a user ID to filter by user
                </p>
              </div>
              
              <div>
                <button
                  onClick={forceRefreshFeed}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                >
                  Force Feed Refresh
                </button>
              </div>
            </div>
          </div>
          
          {/* Database Status */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Database Status</h2>
              <button
                onClick={checkDatabase}
                className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>
            
            {dbStatus ? (
              <div className="space-y-3">
                <div className={`p-2 rounded ${dbStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="text-sm font-medium">
                    {dbStatus.success ? 'Connected' : 'Connection Failed'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Record Counts:</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs">Users: <span className="font-medium">{dbStatus.database?.counts?.users || 0}</span></p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs">Posts: <span className="font-medium">{dbStatus.database?.counts?.posts || 0}</span></p>
                    </div>
                  </div>
                </div>
                
                {dbStatus.database?.error && (
                  <div className="p-2 bg-red-50 text-red-700 rounded text-xs">
                    {dbStatus.database.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded text-center text-sm text-gray-500">
                {loading ? 'Loading database status...' : 'Click Refresh to check database status'}
              </div>
            )}
          </div>
          
          {/* Feed State */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-medium mb-4">Feed Component State</h2>
            
            {typeof window !== 'undefined' && window._feedDebugInfo ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs font-medium">State:</p>
                    <p className="text-sm">{window._feedDebugInfo.componentState}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs font-medium">Refreshes:</p>
                    <p className="text-sm">{window._feedDebugInfo.refreshCount}</p>
                  </div>
                </div>
                
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs font-medium">Last Refresh:</p>
                  <p className="text-sm">{new Date(window._feedDebugInfo.lastRefresh).toLocaleTimeString()}</p>
                </div>
                
                {window._feedDebugInfo.errors && window._feedDebugInfo.errors.length > 0 && (
                  <div className="p-2 bg-red-50 rounded">
                    <p className="text-xs font-medium text-red-700">Errors:</p>
                    <ul className="text-xs text-red-600 list-disc pl-4 mt-1 max-h-32 overflow-auto">
                      {window._feedDebugInfo.errors.map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No feed state information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 