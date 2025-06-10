{
    'name': 'Agentic Web',
    'version': '17.0.1.0.0',
    'category': 'Website',
    'summary': 'Protocol-native AI infrastructure for the new internet',
    'description': """
        Agentic Web - The New Internet
        ==============================
        
        Protocol-native AI infrastructure with:
        * Conversational Scroll Engine
        * AI Agent Integration
        * .CryptoCard x Fugio Protocol
        * HNS.ID Identity Management
        * CrossMint Payment Rails
        * VibeCoder IDE Integration
        * ForkD Development Terminal
        
        Features:
        - Chat-style content rendering
        - AI-powered site interpretation
        - Protocol-native financial instruments
        - Sovereign identity management
        - Agent-to-agent commerce
        - Decentralized infrastructure
    """,
    'author': 'Agentic Web Protocol',
    'website': 'https://agenticweb.com',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'website',
        'website_sale',
        'payment',
        'portal',
        'mail',
        'contacts',
        'account',
        'sale',
        'stock',
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/security.xml',
        'data/website_data.xml',
        'views/website_templates.xml',
        'views/agentic_web_views.xml',
        'views/crypto_card_views.xml',
        'views/fugio_protocol_views.xml',
        'views/ai_agent_views.xml',
        'controllers/main.py',
        'static/src/js/chat_stream_engine.js',
        'static/src/js/content_block.js',
        'static/src/js/scroll_trigger.js',
        'static/src/css/agentic_web.css',
    ],
    'assets': {
        'web.assets_frontend': [
            'agentic_web/static/src/js/chat_stream_engine.js',
            'agentic_web/static/src/js/content_block.js',
            'agentic_web/static/src/js/scroll_trigger.js',
            'agentic_web/static/src/css/agentic_web.css',
        ],
        'web.assets_backend': [
            'agentic_web/static/src/js/backend_integration.js',
            'agentic_web/static/src/css/backend_styles.css',
        ],
    },
    'demo': [
        'demo/demo_data.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'sequence': 10,
    'external_dependencies': {
        'python': ['requests', 'beautifulsoup4', 'openai'],
    },
}
