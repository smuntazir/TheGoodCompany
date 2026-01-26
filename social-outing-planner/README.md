# OutingPlan - Social Outing Planner 🗺️

A modern social webapp for planning outings with friends. Create lists of Places of Interest (POIs) and Activities of Interest (AOIs), then drag them onto your calendar to schedule the perfect outing!

## Features ✨

- **🤖 AI Brainstorming**: Chat with AI (Gemini/GPT/Claude) to discover new places and activities
- **📍 Places of Interest (POIs)**: Add places you want to visit with descriptions, locations, and categories
- **🎯 Activities of Interest (AOIs)**: Add activities you want to do with duration and category info
- **📅 Drag & Drop Planning**: Drag POIs and AOIs from your lists directly onto calendar dates
- **🔐 User Authentication**: Secure login and registration
- **📱 Responsive Design**: Works beautifully on desktop and mobile

---

## 🚀 Quick Start (Development)

We have simplified the development flow into a single script.

1.  **Clone the repository**
2.  **Run the development script**:
    ```bash
    ./dev.sh
    ```
    This script will automatically:
    - Create and activate a Python virtual environment
    - Install backend dependencies (`requirements.txt`)
    - Install frontend dependencies
    - Install Rust dependencies and start the Rust Server (Port 5000)
    - Start the React Frontend (Port 3000)

    **Manual Rust Start**:
    ```bash
    cd rust-server
    cargo run
    ```

3.  **Open your browser**: [http://localhost:3000](http://localhost:3000)

---

## 🌍 Production Deployment (Digital Ocean)

This application is designed to be deployed on **Digital Ocean App Platform** (or Heroku).

### 1. Prerequisites
- A Digital Ocean account.
- This repository connected to your Digital Ocean account.

### 2. Configuration
The application requires the following Environment Variables to be set in your App Platform dashboard:

| Variable | Description | Default/Example |
|----------|-------------|-----------------|
| `JWT_SECRET` | Secret key for auth tokens | `your-secret-random-string` |
| `LLM_PROVIDER` | AI Provider (Optional) | `gemini` (default), `openai`, `claude` |
| `LLM_API_KEY` | API Key for the AI Provider | `your-api-key` |
| `DATA_DIR` | **CRITICAL for Data Persistence** | `/app/data` (See below) |

### 3. Data Persistence (CRITICAL) ⚠️

By default, this application stores data in JSON files. On platforms like Digital Ocean App Platform, the filesystem is **ephemeral** (it is wiped every time you deploy or restart).

**To prevent data loss, you MUST use a Persistent Volume:**

1.  In Digital Ocean App Platform, go to your **component settings**.
2.  Find **Storage** or **Volumes**.
3.  Add a new volume.
    - **Mount Path**: `/app/data` (or any path you prefer)
4.  Add an Environment Variable:
    - `DATA_DIR`: `/app/data` (Match the mount path above)

This ensures your `users.json`, `events.json`, etc., are stored on the persistent volume and survive deployments.

### 4. Build & Start Commands
Digital Ocean should auto-detect the `Procfile`, but if you need to configure manually:
- **Build Command**: `./build.sh`
- **Run Command**: `gunicorn --worker-class gthread --threads 8 --timeout 120 app:app`

---

## 📂 Project Structure & Scripts

### Key Files
- `dev.sh`: **The Development Script**. Runs everything locally (Backend + Frontend).
- `build.sh`: **The Production Build Script**. Installs all dependencies and builds the React app.
- `app.py`: The entry point. Serves the API and static React files in production.
- `Procfile`: Instructions for the PaaS (Digital Ocean/Heroku) on how to run the app.

### Directory Structure
```
social-outing-planner/
├── app.py                # Flask Application Entry Point
├── build.sh              # Production Build Script
├── dev.sh                # Local Development Script
├── client/               # React Frontend
│   ├── src/              # React Source Code
│   └── build/            # Compiled Frontend (created on build)
├── server/               # Backend Logic
│   ├── routes/           # API Endpoints
│   ├── storage.py        # JSON File Storage Handler
│   └── config.py         # Configuration Management
└── data/                 # Data Storage (Local) or Mount Point (Prod)
```

## 🛠 Tech Stack

- **Frontend**: React 18, Styled Components, React Beautiful DnD
- **Backend**: Rust (Axum)
- **Database**: JSON Files (managed via `storage.py`, compatible with Persistent Volumes)
- **AI**: Integration with Gemini, OpenAI, or Claude via `llm_provider.py`

## 🤝 Contributing

1. Fork the repo.
2. Run `./dev.sh` to start debugging.
3. Submit a PR!
