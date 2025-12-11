import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-27ffc17a`;

  const checkPlaceholders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/debug/placeholder-events`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug: Placeholder Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={checkPlaceholders}
              disabled={loading}
              className="bg-[#f7941D] hover:bg-[#F79520] text-white mb-4"
            >
              {loading ? 'Loading...' : 'Check Placeholder Events'}
            </Button>

            {debugInfo && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
