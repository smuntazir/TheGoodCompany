from flask import Blueprint, request, jsonify
from server.config import Config
from server.storage import JsonStorage
from server.models import POI, AOI
from server.utils import generate_id, token_required

content_bp = Blueprint('content', __name__)

# POI Routes
@content_bp.route('/pois', methods=['GET'])
@token_required
def get_pois(current_user):
    try:
        pois = JsonStorage.read(Config.POIS_FILE)
        user_pois = [poi for poi in pois if poi.get('userId') == current_user['userId']]
        return jsonify(user_pois)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@content_bp.route('/pois', methods=['POST'])
@token_required
def create_poi(current_user):
    try:
        data = request.get_json()
        pois = JsonStorage.read(Config.POIS_FILE)
        
        poi_data = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId']
        }
        poi = POI.from_dict(poi_data)
        
        pois.append(poi.to_dict())
        JsonStorage.write(Config.POIS_FILE, pois)
        
        return jsonify(poi.to_dict())
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@content_bp.route('/pois/<poi_id>', methods=['DELETE'])
@token_required
def delete_poi(current_user, poi_id):
    try:
        pois = JsonStorage.read(Config.POIS_FILE)
        filtered_pois = [poi for poi in pois if not (poi.get('_id') == poi_id and poi.get('userId') == current_user['userId'])]
        JsonStorage.write(Config.POIS_FILE, filtered_pois)
        
        return jsonify({'message': 'POI deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500

# AOI Routes
@content_bp.route('/aois', methods=['GET'])
@token_required
def get_aois(current_user):
    try:
        aois = JsonStorage.read(Config.AOIS_FILE)
        user_aois = [aoi for aoi in aois if aoi.get('userId') == current_user['userId']]
        return jsonify(user_aois)
    except Exception as error:
        return jsonify({'error': str(error)}), 500

@content_bp.route('/aois', methods=['POST'])
@token_required
def create_aoi(current_user):
    try:
        data = request.get_json()
        aois = JsonStorage.read(Config.AOIS_FILE)
        
        aoi_data = {
            '_id': generate_id(),
            **data,
            'userId': current_user['userId']
        }
        aoi = AOI.from_dict(aoi_data)
        
        aois.append(aoi.to_dict())
        JsonStorage.write(Config.AOIS_FILE, aois)
        
        return jsonify(aoi.to_dict())
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@content_bp.route('/aois/<aoi_id>', methods=['DELETE'])
@token_required
def delete_aoi(current_user, aoi_id):
    try:
        aois = JsonStorage.read(Config.AOIS_FILE)
        filtered_aois = [aoi for aoi in aois if not (aoi.get('_id') == aoi_id and aoi.get('userId') == current_user['userId'])]
        JsonStorage.write(Config.AOIS_FILE, filtered_aois)
        
        return jsonify({'message': 'AOI deleted successfully'})
    except Exception as error:
        return jsonify({'error': str(error)}), 500
