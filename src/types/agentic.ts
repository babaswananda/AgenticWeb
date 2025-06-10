export interface ContentBlockData {
  id?: number;
  content_type: 'header' | 'content' | 'image' | 'video' | 'cta' | 'pricing' | 'feature' | 'testimonial';
  content_html?: string;
  content_text?: string;
  content_data?: Record<string, any>;
  animation_type?: 'fade_in' | 'slide_up' | 'slide_left' | 'zoom_in' | 'bounce';
  ai_summary?: string;
  ai_enhanced?: boolean;
  order_sequence?: number;
}

export interface ChatStreamConfig {
  autoLoad?: boolean;
  batchSize?: number;
  animationDelay?: number;
  enableAI?: boolean;
  theme?: 'dark' | 'light';
  enableScrollTrigger?: boolean;
  threshold?: number;
}

export interface AgenticWebSite {
  id: number;
  name: string;
  domain: string;
  hns_id?: string;
  protocol_tier: 'personal' | 'pro' | 'family' | 'business' | 'enterprise' | 'education' | 'government';
  ai_agents_limit: number;
  memory_limit: number;
  crossmint_enabled: boolean;
  fugio_enabled: boolean;
  cryptocard_enabled: boolean;
  vibecoder_enabled: boolean;
  forkd_enabled: boolean;
  chat_stream_enabled: boolean;
  auto_parse_content: boolean;
  ai_summarization: boolean;
  active: boolean;
  deployment_status: 'draft' | 'deploying' | 'live' | 'maintenance' | 'suspended';
}

export interface AIAgent {
  id: number;
  name: string;
  agent_type: 'assistant' | 'analyzer' | 'creator' | 'moderator' | 'custom';
  model_config: Record<string, any>;
  personality: string;
  capabilities: string[];
  active: boolean;
  site_id: number;
}

export interface CryptoCard {
  id: number;
  card_handle: string;
  hns_domain: string;
  balance: number;
  credit_limit: number;
  fugio_score: number;
  card_status: 'active' | 'suspended' | 'pending';
  site_id: number;
}

export interface FugioProtocol {
  id: number;
  protocol_address: string;
  staking_amount: number;
  credit_issued: number;
  reputation_score: number;
  validator_status: boolean;
  site_id: number;
}

export interface ParsedSiteContent {
  success: boolean;
  blocks: ContentBlockData[];
  has_more: boolean;
  next_offset?: number;
  error?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Electron-specific types
export interface ElectronConfig {
  enableOfflineMode: boolean;
  localAIModel?: string;
  syncInterval: number;
  autoUpdate: boolean;
}

// NPM Package types
export interface AgenticWebPackageConfig {
  apiEndpoint: string;
  apiKey?: string;
  theme: 'dark' | 'light' | 'auto';
  enableAnalytics: boolean;
  customStyles?: Record<string, string>;
}
