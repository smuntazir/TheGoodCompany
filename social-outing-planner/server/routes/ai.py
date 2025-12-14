from flask import Blueprint, request, jsonify
from server.config import Config
from server.storage import JsonStorage
from server.utils import token_required
from llm_provider import get_llm_provider

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
@token_required
def chat_with_ai(current_user):
    """Chat with AI assistant for brainstorming POIs and AOIs"""
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'error': 'Messages array is required'}), 400
        
        # Get user's current data for context
        pois = JsonStorage.read(Config.POIS_FILE)
        aois = JsonStorage.read(Config.AOIS_FILE)
        events = JsonStorage.read(Config.EVENTS_FILE)
        
        user_pois = [poi for poi in pois if poi.get('userId') == current_user['userId']]
        user_aois = [aoi for aoi in aois if aoi.get('userId') == current_user['userId']]
        user_events = [
            event for event in events 
            if event.get('userId') == current_user['userId'] or 
            current_user['userId'] in event.get('sharedWith', [])
        ]
        
        context = {
            'pois': user_pois,
            'aois': user_aois,
            'events': user_events
        }
        
        # Get LLM provider and chat
        try:
            # We assume LLM_PROVIDER is set in env or Config, 
            # but get_llm_provider reads from env by default.
            provider = get_llm_provider()
            result = provider.chat(messages, context)
            
            return jsonify({
                'response': result.get('response', ''),
                'extracted_items': result.get('extracted_items', [])
            })
        except ValueError as ve:
            # Provider not configured
            return jsonify({
                'error': str(ve),
                'hint': 'Please configure LLM_PROVIDER and LLM_API_KEY environment variables'
            }), 503
        except Exception as e:
            return jsonify({
                'error': f'AI service error: {str(e)}'
            }), 500
            
    except Exception as error:
        return jsonify({'error': str(error)}), 400
