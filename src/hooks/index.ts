import { useState, useEffect, useCallback } from 'react';
import { ContentBlockData, ChatStreamConfig } from '../types';

export interface UseChatStreamProps {
  siteId?: number;
  siteUrl?: string;
  apiEndpoint?: string;
  config: ChatStreamConfig;
}

export interface UseChatStreamReturn {
  contentBlocks: ContentBlockData[];
  loadedIndex: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function useChatStream({
  siteId,
  siteUrl,
  apiEndpoint = '/api',
  config,
}: UseChatStreamProps): UseChatStreamReturn {
  const [contentBlocks, setContentBlocks] = useState<ContentBlockData[]>([]);
  const [loadedIndex, setLoadedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchContentBlocks = useCallback(async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = `${apiEndpoint}/demo-content`;
      let body: any = {
        offset,
        limit: config.batchSize,
      };

      if (siteId) {
        endpoint = `${apiEndpoint}/content-blocks/${siteId}`;
      } else if (siteUrl) {
        endpoint = `${apiEndpoint}/parse-site`;
        body.url = siteUrl;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      const newBlocks = data.blocks || [];
      setContentBlocks(prev => offset === 0 ? newBlocks : [...prev, ...newBlocks]);
      setHasMore(data.has_more || false);
      
      if (offset === 0 && config.autoLoad) {
        setLoadedIndex(Math.min(newBlocks.length, config.batchSize));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [siteId, siteUrl, apiEndpoint, config.batchSize, config.autoLoad]);

  const loadMore = useCallback(() => {
    if (loadedIndex < contentBlocks.length) {
      // Load next block from existing content
      setTimeout(() => {
        setLoadedIndex(prev => prev + 1);
      }, config.animationDelay);
    } else if (hasMore && !loading) {
      // Fetch more content from server
      fetchContentBlocks(contentBlocks.length);
    }
  }, [loadedIndex, contentBlocks.length, hasMore, loading, fetchContentBlocks, config.animationDelay]);

  const reset = useCallback(() => {
    setContentBlocks([]);
    setLoadedIndex(0);
    setError(null);
    setHasMore(true);
    fetchContentBlocks(0);
  }, [fetchContentBlocks]);

  useEffect(() => {
    fetchContentBlocks(0);
  }, [fetchContentBlocks]);

  return {
    contentBlocks,
    loadedIndex,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
}

export function useContentParser(url: string) {
  const [content, setContent] = useState<ContentBlockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseContent = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse content');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      setContent(data.blocks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      parseContent();
    }
  }, [parseContent, url]);

  return { content, loading, error, parseContent };
}

export function useScrollTrigger(
  onTrigger: () => void,
  threshold = 0.8,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage >= threshold) {
        onTrigger();
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [onTrigger, threshold, enabled]);
}
