from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import bcrypt
import jwt
import json
import os
from datetime import datetime, timedelta
from functools import wraps
import uuid

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'your-secret-key')
PORT = int(os.environ.get('PORT', 8080))
DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

# File paths
DATA_DIR = 'data'
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
POIS_FILE = os.path.join(DATA_DIR, 'pois.json')
AOIS_FILE = os.path.join(DATA_DIR, 'aois.json')
EVENTS_FILE = os.path.join(DATA_DIR, 'events.json')

def initialize_storage():
    """Initialize data directory and files"""
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        
        files = [USERS_FILE, POIS_FILE, AOIS_FILE, EVENTS_FILE]
        for file_path in files:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump([], f)
        
        print('Local storage initialized')
    except Exception as error:
        print(f'Error initializing storage: {error}')

def read_json_file(file_path):
    """Read JSON file and return data"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except:
        return []

def write_json_file(file_path, data):
    """Write data to JSON file"""
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

def generate_id():
    """Generate unique ID"""
    return str(uuid.uuid4())

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def token_required(f):
    """Decorator for routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = {
                'userId': data['userId'],
                'username': data['username']
            }
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Auth Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        users = read_json_file(USERS_FILE)
        
        # Check if user already exists
        existing_user = next((u for u in users if u['email'] == email or u['username'] == username), None)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        hashed_password = hash_password(password)
        
        user = {
            'id': generate_id(),
            'username': username,
            'email': email,
            'password': hashed_password,
            'createdAt': datetime.now().isoformat()
        }
        
        users.append(user)
        write_json_file(USERS_FILE, users)
        
        token = jwt.encode({
            'userId': user['id'],
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': username,
                'email': email
            }
        })
        
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400
        
        users = read_json_file(USERS_FILE)
        user = next((u for u in users if u['email'] == email), None)
        
        if not user or not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = jwt.encode({
            'userId': user['id'],
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        })
        
    except Exception as error:
        return jsonify({'error': str(error)}), 400

# POI Routes
@app.route('/api/pois', methods=['GET'])
@token_required
def get_pois(current_user):
    try:
        pois = read_json_file(POIS_FILE)
        user_pois = [poi for poi in pois if poi.get('userId') == current_user['userId']]
        return jsonify(user_pois)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@app.route('/api/pois', methods=['POST'])
@token_required
def create_poi(current_user):
    try:
        data = request.get_json()
        pois = read_json_file(POIS_FILE)
        
        poi = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId'],
            'createdAt': datetime.now().isoformat()
        }
        
        pois.append(poi)
        write_json_file(POIS_FILE, pois)
        
        return jsonify(poi)
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@app.route('/api/pois/<poi_id>', methods=['DELETE'])
@token_required
def delete_poi(current_user, poi_id):
    try:
        pois = read_json_file(POIS_FILE)
        filtered_pois = [poi for poi in pois if not (poi.get('_id') == poi_id and poi.get('userId') == current_user['userId'])]
        write_json_file(POIS_FILE, filtered_pois)
        
        return jsonify({'message': 'POI deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500

# AOI Routes
@app.route('/api/aois', methods=['GET'])
@token_required
def get_aois(current_user):
    try:
        aois = read_json_file(AOIS_FILE)
        user_aois = [aoi for aoi in aois if aoi.get('userId') == current_user['userId']]
        return jsonify(user_aois)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@app.route('/api/aois', methods=['POST'])
@token_required
def create_aoi(current_user):
    try:
        data = request.get_json()
        aois = read_json_file(AOIS_FILE)
        
        aoi = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId'],
            'createdAt': datetime.now().isoformat()
        }
        
        aois.append(aoi)
        write_json_file(AOIS_FILE, aois)
        
        return jsonify(aoi)
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@app.route('/api/aois/<aoi_id>', methods=['DELETE'])
@token_required
def delete_aoi(current_user, aoi_id):
    try:
        aois = read_json_file(AOIS_FILE)
        filtered_aois = [aoi for aoi in aois if not (aoi.get('_id') == aoi_id and aoi.get('userId') == current_user['userId'])]
        write_json_file(AOIS_FILE, filtered_aois)
        
        return jsonify({'message': 'AOI deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500

# Users Route
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    try:
        users = read_json_file(USERS_FILE)
        # Return users excluding current user and exclude sensitive data
        user_list = [
            {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
            for user in users if user['id'] != current_user['userId']
        ]
        return jsonify(user_list)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

# Calendar Event Routes
@app.route('/api/events', methods=['GET'])
@token_required
def get_events(current_user):
    try:
        events = read_json_file(EVENTS_FILE)
        # Return events where user is the creator OR is in the sharedWith list
        user_events = [
            event for event in events 
            if event.get('userId') == current_user['userId'] or 
            current_user['userId'] in event.get('sharedWith', [])
        ]
        return jsonify(user_events)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user):
    try:
        data = request.get_json()
        events = read_json_file(EVENTS_FILE)
        
        # Extract sharedWith from data, default to empty list if not provided
        shared_with = data.get('sharedWith', [])
        
        event = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId'],
            'sharedWith': shared_with,
            'createdBy': current_user['username'],
            'createdAt': datetime.now().isoformat()
        }
        
        events.append(event)
        write_json_file(EVENTS_FILE, events)
        
        return jsonify(event)
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@app.route('/api/events/<event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    try:
        events = read_json_file(EVENTS_FILE)
        
        # Find the event to check if user is the creator
        event_to_delete = next((e for e in events if e.get('_id') == event_id), None)
        
        if not event_to_delete:
            return jsonify({'error': 'Event not found'}), 404
        
        # Only allow the creator to delete the event
        if event_to_delete.get('userId') != current_user['userId']:
            return jsonify({'error': 'Only the event creator can delete this event'}), 403
        
        filtered_events = [event for event in events if event.get('_id') != event_id]
        write_json_file(EVENTS_FILE, filtered_events)
        
        return jsonify({'message': 'Event deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500

# Serve React app (for production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    build_folder = 'client/build'
    
    # Check if build folder exists
    if not os.path.exists(build_folder):
        return jsonify({
            'error': 'Frontend not built',
            'message': 'Please run "cd client && npm run build" to build the frontend first'
        }), 500
    
    if path != "" and os.path.exists(os.path.join(build_folder, path)):
        return send_from_directory(build_folder, path)
    else:
        index_path = os.path.join(build_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(build_folder, 'index.html')
        else:
            return jsonify({
                'error': 'Frontend not found',
                'message': 'index.html not found in build folder'
            }), 500

if __name__ == '__main__':
    initialize_storage()
    print(f'Server running on port {PORT}')
    print('Using local file-based storage')
    print(f'Debug mode: {DEBUG}')
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
