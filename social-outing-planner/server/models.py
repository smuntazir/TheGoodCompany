from dataclasses import dataclass, asdict, field
from typing import List, Optional, Any
from datetime import datetime

@dataclass
class BaseModel:
    def to_dict(self):
        """Convert dataclass to dictionary"""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create instance from dictionary, ignoring extra fields"""
        if not data:
            return None
        # Get valid field names from the dataclass
        valid_fields = cls.__dataclass_fields__.keys()
        # Filter input data to only include valid fields
        filtered_data = {k: v for k, v in data.items() if k in valid_fields}
        return cls(**filtered_data)

@dataclass
class User(BaseModel):
    id: str
    username: str
    email: str
    password: str
    createdAt: str = field(default_factory=lambda: datetime.now().isoformat())
    friends: List[str] = field(default_factory=list)
    friendRequests: List[str] = field(default_factory=list)

@dataclass
class POI(BaseModel):
    _id: str
    userId: str
    name: str = ""
    location: str = ""
    description: str = ""
    category: str = "other"
    createdAt: str = field(default_factory=lambda: datetime.now().isoformat())

@dataclass
class AOI(BaseModel):
    _id: str
    userId: str
    name: str = ""
    description: str = ""
    duration: str = ""
    category: str = "other"
    createdAt: str = field(default_factory=lambda: datetime.now().isoformat())

@dataclass
class Event(BaseModel):
    _id: str
    userId: str
    createdBy: str
    title: str = ""
    date: str = ""
    startTime: str = ""
    endTime: str = ""
    description: str = ""
    type: str = ""
    location: Optional[str] = None
    duration: Optional[int] = None
    category: str = ""
    start: str = ""
    end: str = ""
    allDay: bool = False
    resource: Any = None # For dragging payload
    sharedWith: List[str] = field(default_factory=list)
    createdAt: str = field(default_factory=lambda: datetime.now().isoformat())
