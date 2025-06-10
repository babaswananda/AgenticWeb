import { NextRequest, NextResponse } from 'next/server';
import { ContentBlockData } from '@/types/agentic';

const demoContent: ContentBlockData[] = [
  {
    id: 1,
    content_type: 'header',
    content_html: `
      <div class="text-center">
        <h1 class="text-5xl font-light mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🚀 Welcome to Agentic Web
        </h1>
        <p class="text-xl text-blue-200">Protocol-Native AI Infrastructure</p>
      </div>
    `,
    content_text: 'Welcome to Agentic Web - Protocol-Native AI Infrastructure',
    animation_type: 'fade_in',
    ai_summary: 'Introduction to Agentic Web as the new internet infrastructure for AI agents',
    ai_enhanced: true,
    order_sequence: 1,
  },
  {
    id: 2,
    content_type: 'content',
    content_html: `
      <div class="space-y-4">
        <p class="text-lg leading-relaxed">
          Experience the future of web interaction with our <strong>Conversational Scroll Engine</strong>. 
          Each section loads dynamically as you scroll, creating an immersive, chat-like experience.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-blue-600/20 p-4 rounded-lg border border-blue-500/30">
            <div class="text-2xl mb-2">🤖</div>
            <h3 class="font-semibold mb-2">AI Agents</h3>
            <p class="text-sm text-gray-300">Deploy autonomous agents with domain-native identity</p>
          </div>
          <div class="bg-purple-600/20 p-4 rounded-lg border border-purple-500/30">
            <div class="text-2xl mb-2">💳</div>
            <h3 class="font-semibold mb-2">.CryptoCard</h3>
            <p class="text-sm text-gray-300">Protocol-native financial instruments</p>
          </div>
          <div class="bg-green-600/20 p-4 rounded-lg border border-green-500/30">
            <div class="text-2xl mb-2">⚙️</div>
            <h3 class="font-semibold mb-2">ForkD Terminal</h3>
            <p class="text-sm text-gray-300">Fork and deploy any protocol</p>
          </div>
        </div>
      </div>
    `,
    content_text: 'Experience the future of web interaction with our Conversational Scroll Engine',
    animation_type: 'slide_up',
    ai_summary: 'Overview of core Agentic Web features including AI agents, CryptoCard, and ForkD terminal',
    ai_enhanced: true,
    order_sequence: 2,
  },
  {
    id: 3,
    content_type: 'feature',
    content_html: `
      <div class="feature-card bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl border border-blue-500/20">
        <div class="flex items-center gap-4 mb-4">
          <div class="text-4xl">🧠</div>
          <div>
            <h3 class="text-2xl font-semibold text-blue-200">Conversational Scroll Engine</h3>
            <p class="text-blue-300">Powered by React + Framer Motion</p>
          </div>
        </div>
        <p class="text-gray-300 leading-relaxed mb-4">
          This demo showcases our revolutionary approach to web content delivery. Instead of traditional page loads, 
          content streams in progressively as you scroll, creating a chat-like experience that keeps users engaged.
        </p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="bg-black/30 p-3 rounded-lg">
            <div class="text-green-400 font-semibold">✅ Dynamic Loading</div>
            <div class="text-gray-400">Content loads on demand</div>
          </div>
          <div class="bg-black/30 p-3 rounded-lg">
            <div class="text-green-400 font-semibold">✅ AI Enhanced</div>
            <div class="text-gray-400">Smart content summarization</div>
          </div>
          <div class="bg-black/30 p-3 rounded-lg">
            <div class="text-green-400 font-semibold">✅ Smooth Animations</div>
            <div class="text-gray-400">Framer Motion powered</div>
          </div>
          <div class="bg-black/30 p-3 rounded-lg">
            <div class="text-green-400 font-semibold">✅ Protocol Native</div>
            <div class="text-gray-400">Built for the Agentic Web</div>
          </div>
        </div>
      </div>
    `,
    content_text: 'Conversational Scroll Engine - Revolutionary approach to web content delivery',
    animation_type: 'zoom_in',
    ai_summary: 'Technical overview of the Conversational Scroll Engine and its key features',
    ai_enhanced: true,
    order_sequence: 3,
  },
  {
    id: 4,
    content_type: 'pricing',
    content_html: `
      <div class="text-center space-y-6">
        <h2 class="text-3xl font-light text-yellow-200">Protocol Access Tiers</h2>
        <p class="text-gray-300">Stake your position in the infrastructure layer</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-600">
            <div class="text-2xl mb-2">👤</div>
            <h3 class="text-xl font-semibold mb-2">Personal</h3>
            <div class="text-3xl font-bold text-blue-400 mb-4">$9<span class="text-sm text-gray-400">/mo</span></div>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• 1 AI agent</li>
              <li>• 2GB memory</li>
              <li>• Single-user auth</li>
              <li>• 1 AYD handle</li>
            </ul>
          </div>
          <div class="bg-gradient-to-b from-blue-800 to-blue-900 p-6 rounded-xl border border-blue-500 transform scale-105">
            <div class="text-2xl mb-2">⚡</div>
            <h3 class="text-xl font-semibold mb-2">Pro</h3>
            <div class="text-3xl font-bold text-blue-400 mb-4">$49<span class="text-sm text-gray-400">/mo</span></div>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Up to 3 AI agents</li>
              <li>• 10GB shared memory</li>
              <li>• Multi-device auth</li>
              <li>• Up to 3 AYD handles</li>
            </ul>
          </div>
          <div class="bg-gradient-to-b from-purple-800 to-purple-900 p-6 rounded-xl border border-purple-500">
            <div class="text-2xl mb-2">🏢</div>
            <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
            <div class="text-3xl font-bold text-purple-400 mb-4">Custom</div>
            <ul class="text-sm text-gray-300 space-y-2">
              <li>• Unlimited agents</li>
              <li>• Custom infrastructure</li>
              <li>• White-label environments</li>
              <li>• Protocol tranche access</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    content_text: 'Protocol Access Tiers - Personal, Pro, and Enterprise options',
    animation_type: 'slide_up',
    ai_summary: 'Pricing structure for different protocol access levels with varying features and capabilities',
    ai_enhanced: true,
    order_sequence: 4,
  },
  {
    id: 5,
    content_type: 'cta',
    content_html: `
      <div class="cta-section text-center space-y-6 py-12">
        <div class="text-6xl mb-4">🚀</div>
        <h2 class="text-4xl font-light text-white mb-4">Ready to Initialize Protocol?</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join the new internet. Deploy your AI infrastructure. 
          Stake your position in the protocol layer.
        </p>
        <div class="space-y-4">
          <button class="cta-btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
            🔐 Begin Protocol Initialization
          </button>
          <div class="text-sm text-gray-400">
            No banks. No middlemen. Just cryptographic control.
          </div>
        </div>
      </div>
    `,
    content_text: 'Ready to Initialize Protocol? Begin Protocol Initialization',
    animation_type: 'bounce',
    ai_summary: 'Call-to-action for users to begin protocol initialization and join the Agentic Web',
    ai_enhanced: true,
    order_sequence: 5,
  },
  {
    id: 6,
    content_type: 'testimonial',
    content_html: `
      <div class="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 p-8 rounded-xl border border-indigo-500/30">
        <div class="text-center space-y-4">
          <div class="text-4xl">💬</div>
          <blockquote class="text-xl italic text-blue-200 leading-relaxed">
            "This isn't just a website. It's a glimpse into the future of human-AI interaction. 
            The conversational scroll experience feels natural and engaging."
          </blockquote>
          <div class="space-y-2">
            <div class="font-semibold text-white">Alex Chen</div>
            <div class="text-sm text-gray-400">Protocol Engineer, DeFi Labs</div>
          </div>
        </div>
      </div>
    `,
    content_text: 'Testimonial from Alex Chen about the conversational scroll experience',
    animation_type: 'fade_in',
    ai_summary: 'User testimonial highlighting the innovative nature of the conversational scroll interface',
    ai_enhanced: true,
    order_sequence: 6,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offset = 0, limit = 10 } = body;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, demoContent.length);
    const blocks = demoContent.slice(startIndex, endIndex);
    const hasMore = endIndex < demoContent.length;

    return NextResponse.json({
      success: true,
      blocks,
      has_more: hasMore,
      next_offset: hasMore ? endIndex : null,
      total: demoContent.length,
    });
  } catch (error) {
    console.error('Error in demo-content API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
