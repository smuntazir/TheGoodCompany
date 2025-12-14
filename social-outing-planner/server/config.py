import os

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
    PORT = int(os.environ.get('PORT', 8080))
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # LLM
    LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'gemini')
    LLM_API_KEY = os.environ.get('LLM_API_KEY')
    
    # Paths
    # root/server/config.py -> root/server -> root
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, 'data')
    
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
