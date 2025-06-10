from odoo import http
from odoo.http import request
import json
import logging

_logger = logging.getLogger(__name__)


class ChatStreamController(http.Controller):
    
    @http.route('/agentic/chat-stream/<int:site_id>', type='http', auth='public', website=True)
    def chat_stream_view(self, site_id, **kwargs):
        """Render the chat stream interface for a site"""
        site = request.env['agentic.web.site'].sudo().browse(site_id)
        if not site.exists():
            return request.not_found()
        
        # Get content blocks for the site
        content_blocks = request.env['agentic.content.block'].sudo().search([
            ('site_id', '=', site_id)
        ], order='order_sequence, id')
        
        values = {
            'site': site,
            'content_blocks': content_blocks,
            'chat_stream_enabled': site.chat_stream_enabled,
        }
        
        return request.render('agentic_web.chat_stream_template', values)
    
    @http.route('/agentic/api/content-blocks/<int:site_id>', type='json', auth='public')
    def get_content_blocks(self, site_id, offset=0, limit=10, **kwargs):
        """API endpoint to get content blocks for progressive loading"""
        try:
            site = request.env['agentic.web.site'].sudo().browse(site_id)
            if not site.exists():
                return {'error': 'Site not found'}
            
            content_blocks = request.env['agentic.content.block'].sudo().search([
                ('site_id', '=', site_id)
            ], order='order_sequence, id', offset=offset, limit=limit)
            
            blocks_data = []
            for block in content_blocks:
                block_data = {
                    'id': block.id,
                    'content_type': block.content_type,
                    'content_html': block.content_html,
                    'content_text': block.content_text,
                    'animation_type': block.animation_type,
                    'ai_summary': block.ai_summary if block.ai_enhanced else None,
                }
                blocks_data.append(block_data)
            
            return {
                'success': True,
                'blocks': blocks_data,
                'has_more': len(content_blocks) == limit,
                'next_offset': offset + limit if len(content_blocks) == limit else None,
            }
            
        except Exception as e:
            _logger.error(f"Error fetching content blocks: {str(e)}")
            return {'error': 'Internal server error'}
    
    @http.route('/agentic/api/parse-site', type='json', auth='user')
    def parse_site_content(self, site_id, url=None, **kwargs):
        """API endpoint to trigger site content parsing"""
        try:
            site = request.env['agentic.web.site'].browse(site_id)
            if not site.exists():
                return {'error': 'Site not found'}
            
            # Check permissions
            if not request.env.user.has_group('agentic_web.group_agentic_web_manager'):
                return {'error': 'Insufficient permissions'}
            
            # Parse the site content
            success = site.parse_site_content()
            
            if success:
                return {
                    'success': True,
                    'message': 'Site content parsed successfully',
                    'blocks_count': len(site.content_block_ids),
                }
            else:
                return {'error': 'Failed to parse site content'}
                
        except Exception as e:
            _logger.error(f"Error parsing site content: {str(e)}")
            return {'error': 'Internal server error'}
    
    @http.route('/agentic/api/ai-enhance/<int:block_id>', type='json', auth='user')
    def ai_enhance_block(self, block_id, **kwargs):
        """API endpoint to enhance a content block with AI"""
        try:
            block = request.env['agentic.content.block'].browse(block_id)
            if not block.exists():
                return {'error': 'Content block not found'}
            
            # Check permissions
            if not request.env.user.has_group('agentic_web.group_agentic_web_user'):
                return {'error': 'Insufficient permissions'}
            
            # Generate AI summary
            success = block.generate_ai_summary()
            
            if success:
                return {
                    'success': True,
                    'ai_summary': block.ai_summary,
                    'ai_enhanced': block.ai_enhanced,
                }
            else:
                return {'error': 'Failed to enhance content block'}
                
        except Exception as e:
            _logger.error(f"Error enhancing content block: {str(e)}")
            return {'error': 'Internal server error'}
    
    @http.route('/agentic/demo', type='http', auth='public', website=True)
    def demo_chat_stream(self, **kwargs):
        """Demo page for the chat stream engine"""
        # Create or get demo site
        demo_site = request.env['agentic.web.site'].sudo().search([
            ('name', '=', 'Demo Site')
        ], limit=1)
        
        if not demo_site:
            demo_site = request.env['agentic.web.site'].sudo().create({
                'name': 'Demo Site',
                'domain': 'demo.agenticweb.com',
                'protocol_tier': 'enterprise',
                'chat_stream_enabled': True,
                'ai_summarization': True,
            })
            
            # Create demo content blocks
            demo_blocks = [
                {
                    'content_type': 'header',
                    'content_html': '<h1>🚀 Welcome to Agentic Web</h1>',
                    'content_text': 'Welcome to Agentic Web',
                    'order_sequence': 1,
                },
                {
                    'content_type': 'content',
                    'content_html': '<p>Protocol-native AI infrastructure for the new internet. Experience the future of web interaction.</p>',
                    'content_text': 'Protocol-native AI infrastructure for the new internet',
                    'order_sequence': 2,
                },
                {
                    'content_type': 'feature',
                    'content_html': '<div class="feature-card"><h3>🤖 AI Agents</h3><p>Deploy autonomous agents with domain-native identity</p></div>',
                    'content_text': 'AI Agents - Deploy autonomous agents with domain-native identity',
                    'order_sequence': 3,
                },
                {
                    'content_type': 'feature',
                    'content_html': '<div class="feature-card"><h3>💳 .CryptoCard</h3><p>Protocol-native financial instruments for the autonomous economy</p></div>',
                    'content_text': '.CryptoCard - Protocol-native financial instruments',
                    'order_sequence': 4,
                },
                {
                    'content_type': 'cta',
                    'content_html': '<div class="cta-section"><h2>Ready to Initialize Protocol?</h2><button class="cta-btn">🚀 Begin Protocol Initialization</button></div>',
                    'content_text': 'Ready to Initialize Protocol? Begin Protocol Initialization',
                    'order_sequence': 5,
                },
            ]
            
            for block_data in demo_blocks:
                block_data['site_id'] = demo_site.id
                request.env['agentic.content.block'].sudo().create(block_data)
        
        return request.redirect(f'/agentic/chat-stream/{demo_site.id}')
    
    @http.route('/agentic/embed/<int:site_id>', type='http', auth='public')
    def embed_chat_stream(self, site_id, **kwargs):
        """Embeddable chat stream widget"""
        site = request.env['agentic.web.site'].sudo().browse(site_id)
        if not site.exists():
            return request.not_found()
        
        values = {
            'site': site,
            'embed_mode': True,
        }
        
        return request.render('agentic_web.chat_stream_embed', values)
