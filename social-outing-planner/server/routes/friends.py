from flask import Blueprint, request, jsonify
from server.config import Config
from server.storage import JsonStorage
from server.utils import token_required

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/friends/request', methods=['POST'])
@token_required
def send_friend_request(current_user):
    try:
        data = request.get_json()
        target_username = data.get('username')
        
        if not target_username:
            return jsonify({'error': 'Username is required'}), 400
            
        users = JsonStorage.read(Config.USERS_FILE)
        
        # Find target user
        target_user = next((u for u in users if u['username'].lower() == target_username.lower()), None)
        
        # Silent failure if user doesn't exist (Security/Privacy)
        if not target_user:
            return jsonify({'message': 'Request sent'}), 200
            
        # Prevent self-request
        if target_user['id'] == current_user['userId']:
             return jsonify({'message': 'Request sent'}), 200

        # Check if already friends or requested
        # Ensure we handle missing keys safely (backward compatibility)
        target_friends = target_user.get('friends', [])
        target_requests = target_user.get('friendRequests', [])
        
        if current_user['userId'] in target_friends:
             return jsonify({'message': 'Request sent'}), 200
             
        if current_user['userId'] in target_requests:
             return jsonify({'message': 'Request sent'}), 200
             
        # Add request
        target_requests.append(current_user['userId'])
        target_user['friendRequests'] = target_requests
        
        JsonStorage.write(Config.USERS_FILE, users)
        
        return jsonify({'message': 'Request sent'}), 200
        
    except Exception as error:
        print(f"Error sending friend request: {error}")
        return jsonify({'error': 'Internal server error'}), 500

@friends_bp.route('/friends/requests', methods=['GET'])
@token_required
def get_friend_requests(current_user):
    try:
        users = JsonStorage.read(Config.USERS_FILE)
        
        # Get fresh current user object
        my_user = next((u for u in users if u['id'] == current_user['userId']), None)
        if not my_user:
            return jsonify({'error': 'User not found'}), 404
            
        request_ids = my_user.get('friendRequests', [])
        
        # Resolve IDs to usernames
        request_usernames = []
        for uid in request_ids:
            u = next((user for user in users if user['id'] == uid), None)
            if u:
                request_usernames.append({'username': u['username']})
                
        return jsonify(request_usernames), 200
        
    except Exception as error:
        print(f"Error getting friend requests: {error}")
        return jsonify({'error': 'Internal server error'}), 500

@friends_bp.route('/friends/accept', methods=['POST'])
@token_required
def accept_friend(current_user):
    try:
        data = request.get_json()
        target_username = data.get('username')
        
        if not target_username:
            return jsonify({'error': 'Username is required'}), 400
            
        users = JsonStorage.read(Config.USERS_FILE)
        
        my_user = next((u for u in users if u['id'] == current_user['userId']), None)
        target_user = next((u for u in users if u['username'].lower() == target_username.lower()), None)
        
        if not my_user or not target_user:
            return jsonify({'error': 'User not found'}), 404
            
        # Verify request exists
        my_requests = my_user.get('friendRequests', [])
        if target_user['id'] not in my_requests:
            return jsonify({'error': 'No pending request from this user'}), 400
            
        # Add to friends list (both sides)
        my_friends = my_user.get('friends', [])
        target_friends = target_user.get('friends', [])
        
        if target_user['id'] not in my_friends:
            my_friends.append(target_user['id'])
        if my_user['id'] not in target_friends:
            target_friends.append(my_user['id'])
            
        # Remove from requests
        my_requests.remove(target_user['id'])
        
        # Update user objects
        my_user['friends'] = my_friends
        my_user['friendRequests'] = my_requests
        target_user['friends'] = target_friends
        
        JsonStorage.write(Config.USERS_FILE, users)
        
        return jsonify({'message': 'Friend accepted'}), 200
        
    except Exception as error:
        print(f"Error accepting friend: {error}")
        return jsonify({'error': 'Internal server error'}), 500

@friends_bp.route('/friends/reject', methods=['POST'])
@token_required
def reject_friend(current_user):
    try:
        data = request.get_json()
        target_username = data.get('username')
        
        if not target_username:
            return jsonify({'error': 'Username is required'}), 400
            
        users = JsonStorage.read(Config.USERS_FILE)
        
        my_user = next((u for u in users if u['id'] == current_user['userId']), None)
        target_user = next((u for u in users if u['username'].lower() == target_username.lower()), None)
        
        if not my_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Logic: If target user not found, we still might want to remove a stale ID if we had the ID, 
        # but here we are driven by username. 
        # If target_user is None (maybe deleted), we can't easily find their ID to remove from our list 
        # unless we pass ID from frontend. 
        # The frontend requirement says "request has Accept and Delete buttons", usually displayed with Username.
        # If the user account was deleted, it's tricky. 
        # For now, let's assume target_user exists.
        
        if not target_user:
             return jsonify({'error': 'User not found'}), 404

        my_requests = my_user.get('friendRequests', [])
        
        if target_user['id'] in my_requests:
            my_requests.remove(target_user['id'])
            my_user['friendRequests'] = my_requests
            JsonStorage.write(Config.USERS_FILE, users)
            
        return jsonify({'message': 'Request rejected'}), 200
        
    except Exception as error:
        print(f"Error rejecting friend: {error}")
        return jsonify({'error': 'Internal server error'}), 500

@friends_bp.route('/friends/list', methods=['GET'])
@token_required
def get_friends(current_user):
    try:
        users = JsonStorage.read(Config.USERS_FILE)
        
        my_user = next((u for u in users if u['id'] == current_user['userId']), None)
        if not my_user:
            return jsonify({'error': 'User not found'}), 404
            
        friend_ids = my_user.get('friends', [])
        
        friends_list = []
        for uid in friend_ids:
            u = next((user for user in users if user['id'] == uid), None)
            if u:
                friends_list.append({
                    'id': u['id'],
                    'username': u['username'],
                    'email': u['email']
                })
        
        return jsonify(friends_list), 200
        
    except Exception as error:
        print(f"Error getting friends list: {error}")
        return jsonify({'error': 'Internal server error'}), 500

@friends_bp.route('/friends/remove', methods=['POST'])
@token_required
def remove_friend(current_user):
    try:
        data = request.get_json()
        target_username = data.get('username')
        
        if not target_username:
            return jsonify({'error': 'Username is required'}), 400
            
        users = JsonStorage.read(Config.USERS_FILE)
        
        my_user = next((u for u in users if u['id'] == current_user['userId']), None)
        target_user = next((u for u in users if u['username'].lower() == target_username.lower()), None)
        
        if not my_user:
            return jsonify({'error': 'User not found'}), 404
            
        if not target_user:
             return jsonify({'error': 'Target user not found'}), 404
             
        # Remove from friends list (both sides)
        my_friends = my_user.get('friends', [])
        target_friends = target_user.get('friends', [])
        
        if target_user['id'] in my_friends:
            my_friends.remove(target_user['id'])
            
        if my_user['id'] in target_friends:
            target_friends.remove(my_user['id'])
            
        # Update user objects
        my_user['friends'] = my_friends
        target_user['friends'] = target_friends
        
        JsonStorage.write(Config.USERS_FILE, users)
        
        return jsonify({'message': 'Friend removed'}), 200
        
    except Exception as error:
        print(f"Error removing friend: {error}")
        return jsonify({'error': 'Internal server error'}), 500
