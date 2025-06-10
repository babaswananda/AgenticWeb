'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContentBlockData, ChatStreamConfig } from '@/types/agentic';

interface ContentBlockProps {
  data: ContentBlockData;
  index: number;
  config: ChatStreamConfig;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ data, index, config }) => {
  const getAnimationVariants = () => {
    const baseDelay = index * 0.1;
    
    switch (data.animation_type || 'fade_in') {
      case 'slide_up':
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: baseDelay },
        };
      case 'slide_left':
        return {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay: baseDelay },
        };
      case 'zoom_in':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.6, delay: baseDelay },
        };
      case 'bounce':
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: 0.6, 
            delay: baseDelay,
            type: 'spring',
            bounce: 0.4,
          },
        };
      default: // fade_in
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: baseDelay },
        };
    }
  };

  const getBlockTypeStyles = () => {
    switch (data.content_type) {
      case 'header':
        return 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30';
      case 'cta':
        return 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30';
      case 'pricing':
        return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30';
      case 'feature':
        return 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30';
      case 'testimonial':
        return 'bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-indigo-500/30';
      case 'image':
        return 'bg-gray-800/50 border-gray-600/30';
      case 'video':
        return 'bg-red-600/20 border-red-500/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getBlockIcon = () => {
    switch (data.content_type) {
      case 'header':
        return '🎯';
      case 'cta':
        return '🚀';
      case 'pricing':
        return '💰';
      case 'feature':
        return '⚡';
      case 'testimonial':
        return '💬';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      default:
        return '📄';
    }
  };

  const animationProps = getAnimationVariants();
  const blockStyles = getBlockTypeStyles();
  const blockIcon = getBlockIcon();

  return (
    <motion.div
      {...animationProps}
      className={`
        relative
        border
        rounded-2xl
        p-6
        backdrop-blur-sm
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-2xl
        ${blockStyles}
      `}
    >
      {/* Block Type Indicator */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center text-sm">
        {blockIcon}
      </div>

      {/* AI Summary Badge */}
      {data.ai_summary && config.enableAI && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          AI Enhanced
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* AI Summary (if available and enabled) */}
        {data.ai_summary && config.enableAI && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
            className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <span>🤖</span>
              <span className="font-medium">AI Summary</span>
            </div>
            <p>{data.ai_summary}</p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          {data.content_html ? (
            <div
              dangerouslySetInnerHTML={{ __html: data.content_html }}
              className="[&>h1]:text-3xl [&>h1]:font-light [&>h1]:mb-4 [&>h1]:text-white
                         [&>h2]:text-2xl [&>h2]:font-light [&>h2]:mb-3 [&>h2]:text-blue-200
                         [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-2 [&>h3]:text-blue-300
                         [&>p]:text-gray-300 [&>p]:leading-relaxed [&>p]:mb-3
                         [&>ul]:text-gray-300 [&>ul]:space-y-1
                         [&>li]:text-gray-300
                         [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-blue-200
                         [&>img]:rounded-lg [&>img]:shadow-lg [&>img]:w-full
                         [&>.feature-card]:bg-white/5 [&>.feature-card]:border [&>.feature-card]:border-white/10 [&>.feature-card]:rounded-lg [&>.feature-card]:p-4
                         [&>.cta-section]:text-center [&>.cta-section]:py-6
                         [&>.cta-btn]:bg-blue-600 [&>.cta-btn]:hover:bg-blue-700 [&>.cta-btn]:text-white [&>.cta-btn]:px-6 [&>.cta-btn]:py-3 [&>.cta-btn]:rounded-lg [&>.cta-btn]:transition-colors [&>.cta-btn]:inline-block [&>.cta-btn]:mt-4"
            />
          ) : (
            <p className="text-gray-300">{data.content_text}</p>
          )}
        </div>

        {/* Interactive Elements for CTA blocks */}
        {data.content_type === 'cta' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 mt-4"
          >
            <button
              onClick={() => {
                // Handle CTA action
                if (typeof window !== 'undefined') {
                  window.open('/agentic/demo', '_blank');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Try Demo
            </button>
            <button
              onClick={() => {
                // Handle secondary action
                if (typeof window !== 'undefined') {
                  window.open('https://get.poweredbyai', '_blank');
                }
              }}
              className="border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Learn More
            </button>
          </motion.div>
        )}

        {/* Pricing blocks get special treatment */}
        {data.content_type === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-4 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg border border-yellow-500/20"
          >
            <div className="text-center">
              <div className="text-yellow-400 text-sm font-medium mb-2">💎 Protocol Access</div>
              <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                Initialize Protocol
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ContentBlock;
