# Deployment Guide for Digital Ocean

## Problem
The app shows "404 Not Found" because the React frontend hasn't been built for production. The Flask server is trying to serve files from `client/build` which doesn't exist.

## Solution

### Option 1: Build Locally and Deploy (Recommended)

1. **Build the React frontend locally:**
   ```bash
   cd client
   npm install
   npm run build
   cd ..
   ```

2. **Commit the build folder:**
   ```bash
   git add client/build
   git commit -m "Add production build"
   git push
   ```

3. **Redeploy on Digital Ocean**

### Option 2: Configure Digital Ocean Commands

Since the `client/build` folder is already committed, you just need to install Python dependencies:

**In Digital Ocean App Platform Settings:**

- **Build Command**: `pip install -r requirements.txt`
- **Run Command**: `python3 app.py`

The `.do/app.yaml` file in the repo has the correct configuration.

### Option 3: Quick Fix - Build Now

Run this command locally:
```bash
bash build.sh
```

Then commit and push:
```bash
git add client/build
git commit -m "Add frontend build"
git push
```

## Environment Variables to Set on Digital Ocean

Make sure these environment variables are set in your Digital Ocean app:

- `PORT` = `8080` (already set based on your logs)
- `FLASK_DEBUG` = `false` (for production)
- `JWT_SECRET` = A secure random string for JWT tokens

## Verify Build Locally

Before deploying, you can test the production build locally:

1. Build the frontend:
   ```bash
   cd client && npm run build && cd ..
   ```

2. Run the Flask server:
   ```bash
   python app.py
   ```

3. Visit http://localhost:8080 - you should see the app, not a 404

## Troubleshooting

If you still see 404 after building:
- Check that `client/build/index.html` exists
- Check Digital Ocean logs for any build errors
- Verify the PORT environment variable is set to 8080
- Make sure all Python dependencies in requirements.txt are installed

## Production Checklist

- [ ] React app built (`client/build` folder exists)
- [ ] JWT_SECRET environment variable set
- [ ] FLASK_DEBUG set to false
- [ ] PORT set to 8080
- [ ] All dependencies installed (Python and Node)
- [ ] Data directory writable for JSON storage
