"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Basic global refresh function
declare global {
  interface Window {
    forceRefreshFeed?: () => void;
    _feedDebugInfo?: {
      lastRefresh: string;
      refreshCount: number;
      componentState: string;
      errors: string[];
    };
  }
}

// Import the Feed component
const FeedComponent = dynamic(() => import("./feed"), {
  ssr: false, // Load on client to avoid SSR issues
  loading: () => <div className="p-4">Loading posts...</div>,
});

// Client-side wrapper for the Feed component
const ClientFeed = ({ userId }: { userId?: string }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const renderRef = useRef<boolean>(false);
  const [showDebug, setShowDebug] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Initialize debug info
  useEffect(() => {
    window._feedDebugInfo = {
      lastRefresh: new Date().toISOString(),
      refreshCount: 0,
      componentState: "initialized",
      errors: []
    };
  }, []);
  
  // Log errors to debug info
  const logError = (error: string) => {
    console.error(`[FEED ERROR] ${error}`);
    setErrors(prev => [...prev, `${new Date().toLocaleTimeString()}: ${error}`]);
    
    if (window._feedDebugInfo) {
      window._feedDebugInfo.errors.push(error);
    }
  };
  
  // Log when component mounts or userId changes
  useEffect(() => {
    console.log("====== CLIENT FEED DEBUG ======");
    console.log("ClientFeed mounted or updated with userId:", userId);
    console.log("Current refresh key:", refreshKey);
    
    if (window._feedDebugInfo) {
      window._feedDebugInfo.componentState = "updated";
    }
  }, [userId, refreshKey]);
  
  // Force refresh function
  const forceRefresh = () => {
    const timestamp = new Date().toISOString();
    console.log("====== FEED REFRESH ======");
    console.log("Feed refresh triggered at", timestamp);
    console.log("Incrementing refresh key from", refreshKey);
    
    try {
      setRefreshKey(prev => prev + 1);
      
      if (window._feedDebugInfo) {
        window._feedDebugInfo.lastRefresh = timestamp;
        window._feedDebugInfo.refreshCount += 1;
        window._feedDebugInfo.componentState = "refreshing";
      }
    } catch (err) {
      logError(`Error during refresh: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Register the global refresh function
  useEffect(() => {
    console.log("Registering global forceRefreshFeed function");
    window.forceRefreshFeed = forceRefresh;
    
    // Clean up
    return () => {
      console.log("Cleaning up global forceRefreshFeed function");
      delete window.forceRefreshFeed;
    };
  }, []);
  
  // Listen for new post events
  useEffect(() => {
    console.log("Setting up new-post-created event listener");
    
    const handleNewPost = () => {
      console.log("New post event received, refreshing feed");
      forceRefresh();
    };
    
    window.addEventListener('new-post-created', handleNewPost);
    
    // Clean up
    return () => {
      console.log("Removing new-post-created event listener");
      window.removeEventListener('new-post-created', handleNewPost);
    };
  }, []);

  console.log("Rendering ClientFeed component, refresh key:", refreshKey);
  
  // Check if the feed component is imported correctly
  useEffect(() => {
    console.log("FeedComponent import check:", typeof FeedComponent);
    if (typeof FeedComponent !== 'function') {
      console.error("FeedComponent import issue:", FeedComponent);
      logError(`FeedComponent import issue: ${typeof FeedComponent}`);
    }
  }, []);
  
  // Log before each render
  useEffect(() => {
    console.log("About to render FeedComponent with userId:", userId, "key:", `feed-${refreshKey}`);
    renderRef.current = true;
    
    if (window._feedDebugInfo) {
      window._feedDebugInfo.componentState = "rendering";
    }
    
    // Test database connectivity
    const checkDbConnectivity = async () => {
      try {
        console.log("Testing DB connectivity from client...");
        const response = await fetch('/api/debug/db-check', { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          const error = await response.text();
          logError(`DB connectivity test failed: ${error}`);
        } else {
          const data = await response.json();
          console.log("DB connectivity test result:", data);
        }
      } catch (err) {
        console.log("DB connectivity test error:", err);
        // This might fail if the API doesn't exist yet, which is expected
      }
    };
    
    checkDbConnectivity();
  }, [userId, refreshKey]);
  
  return (
    <div>
      <div className="flex justify-between p-2">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100"
        >
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
        <button 
          onClick={forceRefresh}
          className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
        >
          ↻ Refresh Posts
        </button>
      </div>
      
      {showDebug && (
        <div className="mb-4 p-3 border border-gray-200 bg-gray-50 rounded text-xs">
          <h3 className="font-bold mb-1">Feed Debug Info</h3>
          <div>User ID: {userId || 'none'}</div>
          <div>Refresh Key: {refreshKey}</div>
          <div>Last Refresh: {window._feedDebugInfo?.lastRefresh || 'never'}</div>
          <div>Refresh Count: {window._feedDebugInfo?.refreshCount || 0}</div>
          <div>Component State: {window._feedDebugInfo?.componentState || 'unknown'}</div>
          
          {errors.length > 0 && (
            <div className="mt-2">
              <h4 className="font-bold text-red-500">Errors:</h4>
              <ul className="text-red-500">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <Suspense fallback={
        <div className="animate-pulse p-4 flex flex-col gap-4">
          <div className="h-20 bg-gray-100 rounded-lg"></div>
          <div className="h-20 bg-gray-100 rounded-lg"></div>
          <div className="h-20 bg-gray-100 rounded-lg"></div>
        </div>
      }>
        <FeedComponent userId={userId} key={`feed-${refreshKey}`} />
      </Suspense>
    </div>
  );
};

export default ClientFeed; 