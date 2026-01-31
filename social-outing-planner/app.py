from flask import Flask, send_from_directory
from flask_cors import CORS
from server.config import Config
from server.storage import JsonStorage
import os

# Create app
app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)
app.config.from_object(Config)

# Register Blueprints
from server.routes.auth import auth_bp
from server.routes.content import content_bp
from server.routes.planning import planning_bp
from server.routes.ai import ai_bp

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(content_bp, url_prefix='/api')
app.register_blueprint(planning_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api')

from server.routes.friends import friends_bp
app.register_blueprint(friends_bp, url_prefix='/api')

# Routes for Serve React App
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Verify strict configuration
    try:
        Config.check_configuration()
    except ValueError as e:
        print(f"Configuration Error: {e}")
        print("WARNING: Proceeding with defaults or risk of failure.")

    JsonStorage.initialize()
    print(f'Server running on port {Config.PORT}')
    print('Using local file-based storage')
    print(f'Debug mode: {Config.DEBUG}')
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
