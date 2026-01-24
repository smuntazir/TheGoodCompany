import os

def load_env_manual():
    """Manually load .env file if it exists"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    # Remove comments if present on the same line
                    if ' #' in value:
                        value = value.split(' #', 1)[0]
                    os.environ[key.strip()] = value.strip()

# Load environment variables
load_env_manual()

class Config:
    """Base Configuration"""
    # Security
    SECRET_KEY = os.environ.get('JWT_SECRET')
    # We will raise an error in production if this is missing, 
    # but for now we'll allow it to fail at runtime or use a default if strictly dev?
    # The plan said "remove hardcoded defaults".
    # We'll enforce it but maybe allow a default for the user to not be immediately blocked if they didn't see the instruction yet.
    # Actually, let's follow the plan: "remove hardcoded defaults".
    
    # App
    # In development, we use BACKEND_PORT to avoid conflicts with React's PORT env var.
    # In production (Digital Ocean), we use the standard PORT env var.
    PORT = int(os.environ.get('BACKEND_PORT', os.environ.get('PORT', 5001)))
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # LLM
    LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'gemini')
    LLM_API_KEY = os.environ.get('LLM_API_KEY')
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Allow data directory to be overridden by environment variable (for production persistence)
    DATA_DIR = os.environ.get('DATA_DIR', os.path.join(BASE_DIR, 'data'))
    
    # File Paths
    USERS_FILE = os.path.join(DATA_DIR, 'users.json')
    POIS_FILE = os.path.join(DATA_DIR, 'pois.json')
    AOIS_FILE = os.path.join(DATA_DIR, 'aois.json')
    EVENTS_FILE = os.path.join(DATA_DIR, 'events.json')

    @classmethod
    def check_configuration(cls):
        """Verify required configuration variables are set"""
        missing = []
        if not cls.SECRET_KEY:
            missing.append("JWT_SECRET")
        # LLM_API_KEY is optional if not using AI? The app logic seems to allow it.
        # But we should warn.
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
