from flask import Blueprint, request, jsonify
from datetime import datetime
from server.config import Config
from server.storage import JsonStorage
from server.models import Event
from server.utils import generate_id, token_required

planning_bp = Blueprint('planning', __name__)

@planning_bp.route('/events', methods=['GET'])
@token_required
def get_events(current_user):
    try:
        events = JsonStorage.read(Config.EVENTS_FILE)
        # Return events where user is the creator OR is in the sharedWith list
        user_events = [
            event for event in events 
            if event.get('userId') == current_user['userId'] or 
            current_user['userId'] in event.get('sharedWith', [])
        ]
        return jsonify(user_events)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@planning_bp.route('/events', methods=['POST'])
@token_required
def create_event(current_user):
    try:
        data = request.get_json()
        events = JsonStorage.read(Config.EVENTS_FILE)
        
        # Extract sharedWith from data, default to empty list if not provided
        # shared_with = data.get('sharedWith', []) 
        # Model handles defaults if not provided, but we pass data directly.
        
        event_data = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId'],
            'createdBy': current_user['username']
        }
        event = Event.from_dict(event_data)
        
        events.append(event.to_dict())
        JsonStorage.write(Config.EVENTS_FILE, events)
        
        return jsonify(event.to_dict())
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@planning_bp.route('/events/<event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    try:
        events = JsonStorage.read(Config.EVENTS_FILE)
        
        # Find the event to check if user is the creator
        event_to_delete = next((e for e in events if e.get('_id') == event_id), None)
        
        if not event_to_delete:
            return jsonify({'error': 'Event not found'}), 404
        
        # Only allow the creator to delete the event
        if event_to_delete.get('userId') != current_user['userId']:
            return jsonify({'error': 'Only the event creator can delete this event'}), 403
        
        filtered_events = [event for event in events if event.get('_id') != event_id]
        JsonStorage.write(Config.EVENTS_FILE, filtered_events)
        
        return jsonify({'message': 'Event deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500
