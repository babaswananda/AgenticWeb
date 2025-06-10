'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from './ContentBlock';
import ScrollTriggerController from './ScrollTriggerController';
import { ContentBlockData, ChatStreamConfig } from '@/types/agentic';

interface ChatStreamEngineProps {
  siteId?: number;
  siteUrl?: string;
  config?: ChatStreamConfig;
  className?: string;
  embedMode?: boolean;
}

const ChatStreamEngine: React.FC<ChatStreamEngineProps> = ({
  siteId,
  siteUrl,
  config = {},
  className = '',
  embedMode = false,
}) => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlockData[]>([]);
  const [loadedIndex, setLoadedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const defaultConfig: ChatStreamConfig = {
    autoLoad: true,
    batchSize: 3,
    animationDelay: 500,
    enableAI: true,
    theme: 'dark',
    ...config,
  };

  const fetchContentBlocks = useCallback(async (offset = 0) => {
    try {
      setLoading(true);
      
      let response;
      if (siteId) {
        // Fetch from Odoo backend
        response = await fetch('/agentic/api/content-blocks/' + siteId, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              offset,
              limit: defaultConfig.batchSize,
            },
          }),
        });
      } else if (siteUrl) {
        // Fetch from external site parser
        response = await fetch('/api/parse-site', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: siteUrl,
            offset,
            limit: defaultConfig.batchSize,
          }),
        });
      } else {
        // Use demo data
        response = await fetch('/api/demo-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset,
            limit: defaultConfig.batchSize,
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const newBlocks = data.blocks || [];
      setContentBlocks(prev => offset === 0 ? newBlocks : [...prev, ...newBlocks]);
      setHasMore(data.has_more || false);
      
      if (offset === 0 && defaultConfig.autoLoad) {
        setLoadedIndex(Math.min(newBlocks.length, defaultConfig.batchSize));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [siteId, siteUrl, defaultConfig.batchSize, defaultConfig.autoLoad]);

  useEffect(() => {
    fetchContentBlocks(0);
  }, [fetchContentBlocks]);

  const handleScrollTrigger = useCallback(() => {
    if (loadedIndex < contentBlocks.length) {
      // Load next block from existing content
      setTimeout(() => {
        setLoadedIndex(prev => prev + 1);
      }, defaultConfig.animationDelay);
    } else if (hasMore && !loading) {
      // Fetch more content from server
      fetchContentBlocks(contentBlocks.length);
    }
  }, [loadedIndex, contentBlocks.length, hasMore, loading, fetchContentBlocks, defaultConfig.animationDelay]);

  const containerClasses = `
    ${embedMode ? 'h-full' : 'min-h-screen'}
    bg-gradient-to-b from-black to-gray-900
    text-white
    relative
    overflow-y-auto
    ${className}
  `;

  if (error) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchContentBlocks(0);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Header */}
      {!embedMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 p-4"
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🚀</div>
              <div>
                <h1 className="text-xl font-light">Agentic Web</h1>
                <p className="text-sm text-blue-400">Chat Stream Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Stream */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <AnimatePresence>
          {contentBlocks.slice(0, loadedIndex).map((block, index) => (
            <ContentBlock
              key={block.id || index}
              data={block}
              index={index}
              config={defaultConfig}
            />
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center gap-3 text-blue-400">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading content...</span>
            </div>
          </motion.div>
        )}

        {/* End of Content */}
        {!hasMore && !loading && contentBlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-gray-400"
          >
            <div className="text-2xl mb-2">✨</div>
            <p>You've reached the end of the stream</p>
          </motion.div>
        )}
      </div>

      {/* Scroll Trigger */}
      <ScrollTriggerController
        onTrigger={handleScrollTrigger}
        threshold={0.8}
        enabled={!loading && (loadedIndex < contentBlocks.length || hasMore)}
      />

      {/* Protocol Links */}
      {!embedMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="flex gap-4 bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3">
            <a
              href="https://get.poweredbyai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              <span>🤖</span>
              <span className="font-mono">get.poweredbyai</span>
            </a>
            <a
              href="https://agi.unifiedai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              <span>🧠</span>
              <span className="font-mono">agi.unifiedai</span>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatStreamEngine;
