from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
from server.config import Config
from server.storage import JsonStorage
from server.models import User
from server.utils import hash_password, verify_password, generate_id, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        users = JsonStorage.read(Config.USERS_FILE)
        
        # Check if user already exists
        existing_user = next((u for u in users if u['email'].lower() == email.lower() or u['username'].lower() == username.lower()), None)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        hashed_password = hash_password(password)
        
        user = User(
            id=generate_id(),
            username=username,
            email=email,
            password=hashed_password
        )
        
        users.append(user.to_dict())
        JsonStorage.write(Config.USERS_FILE, users)
        
        token = jwt.encode({
            'userId': user.id,
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(days=30)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': username,
                'email': email
            }
        })
        
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400
        
        users = JsonStorage.read(Config.USERS_FILE)
        user = next((u for u in users if u['email'].lower() == email.lower()), None)
        
        # user here is a dict because Read returns dicts
        if not user or not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = jwt.encode({
            'userId': user['id'],
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(days=30)
        }, Config.SECRET_KEY, algorithm='HS256')
        
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

@auth_bp.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    try:
        users = JsonStorage.read(Config.USERS_FILE)
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
