# Complete Setup Guide - Social Outing Planner

## Overview
This guide ensures you properly set up the Social Outing Planner with a Python virtual environment for both development and deployment.

## Why Virtual Environment?
A Python virtual environment isolates project dependencies from your system Python installation, preventing conflicts and ensuring reproducibility across different machines and deployments.

## Local Development Setup

### Step 1: Clone the Repository
```bash
cd social-outing-planner
```

### Step 2: Create Python Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` prefix in your terminal when activated.

### Step 4: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### Step 6: Start Development Servers

**Terminal 1 - Backend (Flask):**
```bash
# Make sure virtual environment is activated (you should see (venv) prefix)
python app.py
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend (React):**
```bash
cd client
npm start
```
Frontend runs on: http://localhost:3000

## Production Build & Testing

### Step 1: Activate Virtual Environment
```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### Step 2: Build Frontend
```bash
bash build.sh
```

### Step 3: Run Production Server
```bash
# Virtual environment must be activated
python app.py
```
App runs on: http://localhost:8080

## Automated Startup Script

For convenience, use the provided `start.sh` script which handles everything:

```bash
bash start.sh
```

This script will:
1. Create virtual environment if it doesn't exist
2. Activate virtual environment
3. Build React frontend (if needed)
4. Install Python dependencies
5. Start the Flask server

## Important Notes

### Virtual Environment Best Practices

- **Always activate** the virtual environment before running the app
- **Always activate** before installing new packages with `pip`
- **Commit** the `venv/` folder to `.gitignore` (already done)
- **Don't commit** the `venv/` folder to git

### Checking Virtual Environment Status

To verify the virtual environment is active:
```bash
which python  # macOS/Linux - should show path inside venv/
# or
where python  # Windows - should show path inside venv/
```

### Deactivating Virtual Environment

When done working:
```bash
deactivate
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"
**Solution:** Virtual environment is not activated. Run:
```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### "command not found: python"
**Solution:** Python is not installed or not in PATH. Install Python 3.7+ from python.org

### "npm: command not found"
**Solution:** Node.js is not installed. Install from nodejs.org

### Virtual environment not created
**Solution:** Run:
```bash
python -m venv venv
```

### Port 5001 or 8080 already in use
**Solution:** Kill the process using that port or modify PORT in app.py

## Deployment Checklist

- [ ] Virtual environment created (`venv/` folder exists)
- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] Frontend built (`bash build.sh` or `npm run build`)
- [ ] Backend starts without errors (`python app.py`)
- [ ] Frontend accessible at http://localhost:8080

## Quick Reference Commands

```bash
# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate
deactivate

# Install dependencies
pip install -r requirements.txt

# Build frontend
bash build.sh

# Start development
python app.py  # Terminal 1
cd client && npm start  # Terminal 2

# Start production
bash start.sh

# Check Python version
python --version

# Check pip version
pip --version
```

## Additional Resources

- See `README.md` for feature overview and API documentation
- See `DEPLOYMENT.md` for Digital Ocean deployment instructions
- See `MOBILE_FIXES.md` for mobile responsiveness improvements
