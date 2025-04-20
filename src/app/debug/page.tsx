'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Debug page to inspect database and app state
export default function DebugPage() {
  const [dbData, setDbData] = useState<any>(null);
  const [schemaData, setSchemaData] = useState<any>(null);
  const [connectionData, setConnectionData] = useState<any>(null);
  const [loading, setLoading] = useState({
    dbCheck: false,
    schema: false,
    connection: false
  });
  const [error, setError] = useState({
    dbCheck: null as string | null,
    schema: null as string | null,
    connection: null as string | null
  });
  
  // Function to check database connectivity
  const checkDatabase = async () => {
    setLoading(prev => ({ ...prev, dbCheck: true }));
    setError(prev => ({ ...prev, dbCheck: null }));
    
    try {
      const response = await fetch('/api/debug/db-check');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setDbData(data);
    } catch (err) {
      console.error('Error checking database:', err);
      setError(prev => ({ 
        ...prev, 
        dbCheck: err instanceof Error ? err.message : String(err)
      }));
    } finally {
      setLoading(prev => ({ ...prev, dbCheck: false }));
    }
  };
  
  // Function to check schema
  const checkSchema = async () => {
    setLoading(prev => ({ ...prev, schema: true }));
    setError(prev => ({ ...prev, schema: null }));
    
    try {
      const response = await fetch('/api/debug/db-schema');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setSchemaData(data);
    } catch (err) {
      console.error('Error checking schema:', err);
      setError(prev => ({ 
        ...prev, 
        schema: err instanceof Error ? err.message : String(err)
      }));
    } finally {
      setLoading(prev => ({ ...prev, schema: false }));
    }
  };
  
  // Function to run deep connection test
  const checkConnection = async () => {
    setLoading(prev => ({ ...prev, connection: true }));
    setError(prev => ({ ...prev, connection: null }));
    
    try {
      const response = await fetch('/api/debug/db-connection');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setConnectionData(data);
    } catch (err) {
      console.error('Error checking connection:', err);
      setError(prev => ({ 
        ...prev, 
        connection: err instanceof Error ? err.message : String(err)
      }));
    } finally {
      setLoading(prev => ({ ...prev, connection: false }));
    }
  };
  
  // Check database on page load
  useEffect(() => {
    checkDatabase();
    checkSchema();
    checkConnection();
    
    // Set up periodic refresh (every 10 seconds)
    const interval = setInterval(() => {
      checkDatabase();
      checkSchema();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get current feed info from window object
  const [feedInfo, setFeedInfo] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initial check
      setFeedInfo(window._feedDebugInfo || null);
      
      // Set up periodic check
      const checkFeedInfo = () => {
        setFeedInfo(window._feedDebugInfo || null);
      };
      
      const interval = setInterval(checkFeedInfo, 1000);
      return () => clearInterval(interval);
    }
  }, []);
  
  // Determine overall system status
  const getSystemStatus = () => {
    if (error.dbCheck || error.schema || error.connection) return "Error";
    if (!dbData || !schemaData) return "Loading";
    
    const dbConnected = dbData.success;
    const hasUsers = dbData.database?.counts?.users > 0;
    const hasPosts = dbData.database?.counts?.posts > 0;
    
    if (!dbConnected) return "Database Connection Issue";
    if (!hasUsers) return "No Users in Database";
    if (!hasPosts) return "No Posts in Database";
    
    return "Ready";
  };
  
  const systemStatus = getSystemStatus();
  const statusColor = {
    "Error": "bg-red-500",
    "Loading": "bg-yellow-500",
    "Database Connection Issue": "bg-red-500",
    "No Users in Database": "bg-orange-500",
    "No Posts in Database": "bg-orange-500",
    "Ready": "bg-green-500"
  }[systemStatus] || "bg-gray-500";
  
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">App Debug Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/debug/feed" className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Test Feed
          </Link>
          <Link href="/" className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
            Back to Home
          </Link>
        </div>
      </div>
      
      {/* System Status */}
      <div className={`mb-6 p-4 rounded-lg text-white ${statusColor}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">System Status: {systemStatus}</h2>
            <p className="text-sm mt-1 opacity-90">
              Last checked: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button 
            onClick={() => { checkDatabase(); checkSchema(); checkConnection(); }}
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-100"
          >
            Refresh Status
          </button>
        </div>
      </div>
      
      {/* Connection Troubleshooter - New Component */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">Database Connection Troubleshooter</h2>
          <button
            onClick={checkConnection}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            disabled={loading.connection}
          >
            {loading.connection ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        
        <div className="p-4">
          {error.connection ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-4">
              Error testing connection: {error.connection}
            </div>
          ) : loading.connection ? (
            <div className="animate-pulse p-4 flex flex-col gap-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : connectionData ? (
            <div>
              <div className={`p-3 rounded-lg mb-4 ${connectionData.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-medium ${connectionData.success ? 'text-green-600' : 'text-red-600'}`}>
                  {connectionData.verdict || (connectionData.success ? 'Database connection is working' : 'Database connection issues detected')}
                </p>
              </div>
              
              {/* Environment Variables Status */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Environment Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className={`p-2 rounded ${connectionData.envVariables.databaseUrlExists ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <p className="text-xs font-medium">DATABASE_URL:</p>
                    <p className="text-sm">{connectionData.envVariables.databaseUrlExists ? 'Set' : 'Missing'}</p>
                  </div>
                  <div className={`p-2 rounded ${connectionData.envVariables.directUrlExists ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <p className="text-xs font-medium">DIRECT_URL:</p>
                    <p className="text-sm">{connectionData.envVariables.directUrlExists ? 'Set' : 'Not set (optional)'}</p>
                  </div>
                  <div className="p-2 rounded bg-gray-50">
                    <p className="text-xs font-medium">DB Type:</p>
                    <p className="text-sm">{connectionData.envVariables.databaseUrlPrefix || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              
              {/* Connection Tests */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Connection Tests</h3>
                <div className="space-y-2">
                  {connectionData.connectionTests.map((test: any, index: number) => (
                    <div key={index} className={`p-2 rounded border ${test.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{test.name}</p>
                        <p className={`text-xs px-2 py-0.5 rounded-full ${test.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {test.success ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                      {test.details && <p className="text-xs text-gray-600 mt-1">{test.details}</p>}
                      {test.error && <p className="text-xs text-red-600 mt-1">{test.error}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Table Queries */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Database Queries</h3>
                <div className="space-y-2">
                  {connectionData.tableQueries.map((query: any, index: number) => (
                    <div key={index} className={`p-2 rounded border ${query.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{query.name}</p>
                        <p className={`text-xs px-2 py-0.5 rounded-full ${query.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {query.success ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                      {query.details && <p className="text-xs text-gray-600 mt-1">{query.details}</p>}
                      {query.error && <p className="text-xs text-red-600 mt-1">{query.error}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Suggested Fixes */}
              {connectionData.suggestedFixes && connectionData.suggestedFixes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Suggested Fixes</h3>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <ul className="text-sm list-disc pl-4 space-y-1">
                      {connectionData.suggestedFixes.map((fix: string, index: number) => (
                        <li key={index}>{fix}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Click "Test Connection" to run a database connection test</p>
          )}
        </div>
      </div>
      
      {/* Data Flow Visualization */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">Data Flow Visualization</h2>
        
        <div className="p-4">
          <div className="flex flex-col gap-4">
            {/* Database Connection */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dbData?.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                1
              </div>
              <div className="flex-1 p-3 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Database Connection</h3>
                <p className="text-sm">
                  Status: {dbData?.success ? 
                    <span className="text-green-600 font-medium">Connected</span> : 
                    <span className="text-red-600 font-medium">Failed</span>
                  }
                </p>
                {dbData?.database?.error && (
                  <p className="text-sm text-red-600 mt-1">{dbData.database.error}</p>
                )}
              </div>
            </div>
            
            {/* Database Tables */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dbData?.database?.counts?.users > 0 && dbData?.database?.counts?.posts > 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                2
              </div>
              <div className="flex-1 p-3 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Database Tables</h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-sm">Users: <span className="font-medium">{dbData?.database?.counts?.users || 0}</span></p>
                  </div>
                  <div>
                    <p className="text-sm">Posts: <span className="font-medium">{dbData?.database?.counts?.posts || 0}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feed Component */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feedInfo ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                3
              </div>
              <div className="flex-1 p-3 border rounded-lg bg-gray-50">
                <h3 className="font-medium">Feed Component</h3>
                {feedInfo ? (
                  <div className="text-sm">
                    <p>State: <span className="font-medium">{feedInfo.componentState}</span></p>
                    <p>Refresh Count: <span className="font-medium">{feedInfo.refreshCount}</span></p>
                    <p>Last Refresh: <span className="font-medium">{new Date(feedInfo.lastRefresh).toLocaleTimeString()}</span></p>
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600">Feed component not loaded</p>
                )}
                
                {feedInfo?.errors?.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-xs text-red-600 font-medium">Feed Errors:</p>
                    <ul className="text-xs text-red-600 list-disc pl-4">
                      {feedInfo.errors.slice(0, 3).map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                      {feedInfo.errors.length > 3 && (
                        <li>...and {feedInfo.errors.length - 3} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Panel */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">Actions</h2>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <h3 className="font-medium mb-2">Refresh Feed</h3>
            <p className="text-sm mb-3">Force refresh the feed component to fetch new data</p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.forceRefreshFeed) {
                  window.forceRefreshFeed();
                }
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Feed
            </button>
          </div>
          
          <div className="p-3 border rounded-lg">
            <h3 className="font-medium mb-2">Test Isolated Feed</h3>
            <p className="text-sm mb-3">View the feed component in isolation for debugging</p>
            <Link href="/debug/feed" className="block text-center w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Open Isolated Feed
            </Link>
          </div>
        </div>
      </div>
      
      {/* Database Details */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">Database Details</h2>
          <button
            onClick={() => { checkDatabase(); checkSchema(); }}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
          >
            Refresh
          </button>
        </div>
        
        <div className="p-4">
          {/* Tables Content */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Tables Structure</h3>
            {schemaData?.tables ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(schemaData.tables).map(([tableName, tableInfo]: [string, any]) => (
                  <div key={tableName} className="border rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
                      <h4 className="font-medium">{tableName}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {tableInfo.count !== 'unknown' ? tableInfo.count : '?'} records
                      </span>
                    </div>
                    
                    <div className="p-2">
                      {tableInfo.error ? (
                        <p className="text-xs text-red-600">{tableInfo.error}</p>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fields:</p>
                          <div className="text-xs bg-gray-50 p-2 rounded max-h-20 overflow-auto">
                            {tableInfo.fields?.join(', ') || 'None'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border rounded text-sm text-gray-500">
                {loading.schema ? 'Loading schema data...' : 'No schema data available'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Fixes */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">Quick Fixes</h2>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium mb-2">Check Database URL</h3>
              <p className="text-sm mb-3">
                Ensure your <code className="bg-gray-100 px-1 py-0.5 rounded">DATABASE_URL</code> is set correctly in <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code>
              </p>
              <div className="p-2 bg-gray-50 rounded text-xs mb-3">
                <p>Example format:</p>
                <code>DATABASE_URL="postgresql://user:password@localhost:5432/dbname"</code>
              </div>
              <button 
                onClick={checkConnection}
                className="w-full bg-gray-100 px-4 py-2 rounded text-sm hover:bg-gray-200"
              >
                Test Connection
              </button>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium mb-2">Database Migration Check</h3>
              <p className="text-sm mb-3">
                If tables are missing, you may need to run Prisma migrations
              </p>
              <div className="p-2 bg-gray-50 rounded text-xs mb-3">
                <p>Run these commands in terminal:</p>
                <pre className="mt-1">npx prisma migrate dev</pre>
                <pre className="mt-1">npx prisma generate</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Troubleshooting Guide */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium p-4 bg-gray-50 border-b">Troubleshooting Guide</h2>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Common Issues</h3>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-red-600">No Database Connection</h4>
                <p className="text-sm mt-1">Check your database connection string in .env file and verify that your database server is running.</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-orange-600">No Users or Posts in Database</h4>
                <p className="text-sm mt-1">If tables exist but have no data, you may need to seed your database or create content through the app.</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-yellow-600">Feed Component Not Loading</h4>
                <p className="text-sm mt-1">Check that the Client Feed component is properly importing and rendering the server Feed component.</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-blue-600">User Authentication Issues</h4>
                <p className="text-sm mt-1">If you're logged in but not seeing your posts, check that your user ID matches the posts' owner IDs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 