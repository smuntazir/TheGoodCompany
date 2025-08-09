const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Local file storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POIS_FILE = path.join(DATA_DIR, 'pois.json');
const AOIS_FILE = path.join(DATA_DIR, 'aois.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Initialize data directory and files
const initializeStorage = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize empty files if they don't exist
    const files = [USERS_FILE, POIS_FILE, AOIS_FILE, EVENTS_FILE];
    for (const file of files) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, '[]');
      }
    }
    console.log('Local storage initialized');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Helper functions for file operations
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Read existing users
    const users = await readJsonFile(USERS_FILE);
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: generateId(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    await writeJsonFile(USERS_FILE, users);
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    res.json({ token, user: { id: user.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === email);
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POI Routes
app.get('/api/pois', authenticateToken, async (req, res) => {
  try {
    const pois = await readJsonFile(POIS_FILE);
    const userPois = pois.filter(poi => poi.userId === req.user.userId);
    res.json(userPois);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pois', authenticateToken, async (req, res) => {
  try {
    const pois = await readJsonFile(POIS_FILE);
    const poi = {
      _id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    pois.push(poi);
    await writeJsonFile(POIS_FILE, pois);
    res.json(poi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/pois/:id', authenticateToken, async (req, res) => {
  try {
    const pois = await readJsonFile(POIS_FILE);
    const filteredPois = pois.filter(poi => !(poi._id === req.params.id && poi.userId === req.user.userId));
    await writeJsonFile(POIS_FILE, filteredPois);
    res.json({ message: 'POI deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AOI Routes
app.get('/api/aois', authenticateToken, async (req, res) => {
  try {
    const aois = await readJsonFile(AOIS_FILE);
    const userAois = aois.filter(aoi => aoi.userId === req.user.userId);
    res.json(userAois);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/aois', authenticateToken, async (req, res) => {
  try {
    const aois = await readJsonFile(AOIS_FILE);
    const aoi = {
      _id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    aois.push(aoi);
    await writeJsonFile(AOIS_FILE, aois);
    res.json(aoi);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/aois/:id', authenticateToken, async (req, res) => {
  try {
    const aois = await readJsonFile(AOIS_FILE);
    const filteredAois = aois.filter(aoi => !(aoi._id === req.params.id && aoi.userId === req.user.userId));
    await writeJsonFile(AOIS_FILE, filteredAois);
    res.json({ message: 'AOI deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calendar Event Routes
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await readJsonFile(EVENTS_FILE);
    const userEvents = events.filter(event => event.userId === req.user.userId);
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await readJsonFile(EVENTS_FILE);
    const event = {
      _id: generateId(),
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };
    events.push(event);
    await writeJsonFile(EVENTS_FILE, events);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const events = await readJsonFile(EVENTS_FILE);
    const filteredEvents = events.filter(event => !(event._id === req.params.id && event.userId === req.user.userId));
    await writeJsonFile(EVENTS_FILE, filteredEvents);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Initialize storage and start server
initializeStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Using local file-based storage');
  });
}).catch(error => {
  console.error('Failed to initialize storage:', error);
  process.exit(1);
});
