import json
import os
import threading
from typing import Any, List
from server.config import Config

class JsonStorage:
    """
    Thread-safe JSON file storage manager.
    Acts as a primitive Repository layer.
    """
    _locks = {
        Config.USERS_FILE: threading.Lock(),
        Config.POIS_FILE: threading.Lock(),
        Config.AOIS_FILE: threading.Lock(),
        Config.EVENTS_FILE: threading.Lock(),
    }
    
    @classmethod
    def initialize(cls):
        """Ensure data directory and files exist"""
        try:
            os.makedirs(Config.DATA_DIR, exist_ok=True)
            files = [Config.USERS_FILE, Config.POIS_FILE, Config.AOIS_FILE, Config.EVENTS_FILE]
            for file_path in files:
                if not os.path.exists(file_path):
                    with open(file_path, 'w') as f:
                        json.dump([], f)
            print('Local storage initialized')
        except Exception as error:
            print(f'Error initializing storage: {error}')

    @classmethod
    def read(cls, file_path: str) -> List[Any]:
        """Read data from JSON file with lock"""
        lock = cls._locks.get(file_path)
        if not lock:
            # If a new file is introduced without a lock, we might default to a new lock 
            # or raise error. For safety in review:
            raise ValueError(f"No lock defined for file: {file_path}")
            
        with lock:
            try:
                # Ensure file exists before reading
                if not os.path.exists(file_path):
                    return []
                with open(file_path, 'r') as f:
                    return json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                return []

    @classmethod
    def write(cls, file_path: str, data: Any):
        """Write data to JSON file with lock"""
        lock = cls._locks.get(file_path)
        if not lock:
            raise ValueError(f"No lock defined for file: {file_path}")
            
        with lock:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
