'use client';

import { useState } from 'react';
import ChatStreamEngine from '@/components/ChatStreamEngine';

export default function ParsePage() {
  const [siteUrl, setSiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStream, setShowStream] = useState(false);

  const handleParseSite = async () => {
    if (!siteUrl) return;
    
    setIsLoading(true);
    // Validate URL and start parsing
    try {
      new URL(siteUrl);
      setShowStream(true);
    } catch {
      alert('Please enter a valid URL');
    } finally {
      setIsLoading(false);
    }
  };

  if (showStream) {
    return (
      <main className="min-h-screen">
        <ChatStreamEngine
          siteUrl={siteUrl}
          config={{
            autoLoad: true,
            batchSize: 3,
            animationDelay: 400,
            enableAI: true,
            theme: 'dark',
          }}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🌐</div>
          <h1 className="text-4xl font-light">Site Parser</h1>
          <p className="text-xl text-gray-300">
            Convert any website into a conversational scroll experience
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleParseSite}
              disabled={!siteUrl || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {isLoading ? '🔄 Parsing...' : '🚀 Parse Site'}
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            Try parsing: http://localhost:8003 (our demo site)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold mb-2">Content Extraction</h3>
            <p className="text-gray-300">Automatically parse and structure website content</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI Enhancement</h3>
            <p className="text-gray-300">Generate summaries and insights for each section</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">💫</div>
            <h3 className="font-semibold mb-2">Smooth Experience</h3>
            <p className="text-gray-300">Transform static pages into dynamic conversations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
