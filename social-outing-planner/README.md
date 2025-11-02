# OutingPlan - Social Outing Planner 🗺️

A modern social webapp for planning outings with friends. Create lists of Places of Interest (POIs) and Activities of Interest (AOIs), then drag them onto your calendar to schedule the perfect outing!

## Features ✨

- **🤖 AI Brainstorming**: Chat with AI (Gemini/GPT/Claude) to discover new places and activities
- **📍 Places of Interest (POIs)**: Add places you want to visit with descriptions, locations, and categories
- **🎯 Activities of Interest (AOIs)**: Add activities you want to do with duration and category info
- **🎯 Drag & Drop Planning**: Drag POIs and AOIs from your lists directly onto calendar dates
- **📅 Interactive Calendar**: Visual monthly calendar with scheduled events
- **🔐 User Authentication**: Secure login and registration system
- **✨ Modern UI**: Beautiful, responsive design with smooth animations
- **⚡ Real-time Updates**: Instant feedback with toast notifications

## Tech Stack 🛠️

**Frontend:**
- React 18 with functional components and hooks
- Styled Components for modern CSS-in-JS styling
- React Beautiful DnD for drag-and-drop functionality
- React Calendar for date selection
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- Lucide React for icons

**Backend:**
- Python Flask web framework
- File-based JSON storage (users, POIs, AOIs, events)
- JWT authentication
- bcrypt for password hashing
- CORS enabled for cross-origin requests

**AI Integration:**
- Google Gemini (gemini-pro)
- OpenAI GPT (gpt-3.5-turbo)
- Anthropic Claude (claude-3-sonnet)
- Flexible provider abstraction layer

## Setup Instructions 🚀

### Prerequisites
- Python 3.7 or higher
- Node.js (v14 or higher) for the React frontend
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd social-outing-planner
   ```

2. **Set up Python virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

6. **Start the development servers:**
   
   **Backend (Python Flask):**
   ```bash
   # Make sure virtual environment is activated
   python app.py
   ```
   
   **Frontend (React):**
   ```bash
   # In a new terminal
   cd client
   npm start
   ```

   This will start:
   - Backend server on http://localhost:5001
   - Frontend development server on http://localhost:3000

### AI Brainstorming Setup (Optional) 🤖

To enable the AI brainstorming feature, you need to configure an LLM provider:

1. **Get an API key** from one of these providers:
   - **Google Gemini** (Free): https://makersuite.google.com/app/apikey
   - **OpenAI GPT** (Paid): https://platform.openai.com/api-keys
   - **Anthropic Claude** (Paid): https://console.anthropic.com/

2. **Set environment variables:**
   ```bash
   export LLM_PROVIDER=gemini  # Options: gemini, openai, gpt, claude, anthropic
   export LLM_API_KEY=your-api-key-here
   ```

3. **Restart the backend server**

For detailed setup instructions, see [AI_SETUP.md](./AI_SETUP.md)

## Usage Guide 📱

1. **Register/Login**: Create an account or sign in
2. **Brainstorm with AI** (if configured): Chat with the AI assistant to discover new ideas
3. **Add POIs**: Click "Add Place" or approve AI suggestions for Places of Interest
4. **Add AOIs**: Click "Add Activity" or approve AI suggestions for Activities of Interest
5. **Plan Your Outing**: Drag POIs and AOIs from the sidebar onto calendar dates
6. **Manage Events**: Click on scheduled events to remove them

## Project Structure 📁

```
social-outing-planner/
├── app.py                # Python Flask backend server
├── llm_provider.py       # AI provider abstraction layer
├── requirements.txt      # Python dependencies
├── AI_SETUP.md          # AI configuration guide
├── venv/                # Python virtual environment
├── data/                # JSON data files
│   ├── users.json       # User data
│   ├── pois.json        # Places of Interest
│   ├── aois.json        # Activities of Interest
│   └── events.json      # Calendar events
├── client/              # React frontend
│   ├── package.json     # Frontend dependencies
│   ├── public/          # Static assets
│   └── src/
│       ├── App.js       # Main app component
│       ├── index.js     # React entry point
│       └── components/  # React components
│           ├── Login.js
│           ├── Register.js
│           ├── Dashboard.js
│           ├── AIChat.js          # NEW: AI chat component
│           ├── DraggablePill.js
│           ├── POIForm.js
│           └── AOIForm.js
```

## API Endpoints 🔌

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Places of Interest
- `GET /api/pois` - Get user's POIs
- `POST /api/pois` - Create new POI
- `DELETE /api/pois/:id` - Delete POI

### Activities of Interest
- `GET /api/aois` - Get user's AOIs
- `POST /api/aois` - Create new AOI
- `DELETE /api/aois/:id` - Delete AOI

### Calendar Events
- `GET /api/events` - Get user's scheduled events
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event

### AI Chat
- `POST /api/chat` - Chat with AI assistant (requires LLM_PROVIDER and LLM_API_KEY configured)

## Future Enhancements 🚀

- ✅ ~~Activity recommendations based on preferences~~ (Implemented via AI Brainstorming)
- Social features (friend system, shared outings)
- Map integration for POI visualization
- Weather integration for outdoor activities
- Collaborative planning with multiple users
- Mobile app version
- Export to external calendars
- Persistent chat history with database storage
- Multi-language AI support

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

MIT License - feel free to use this project for your own purposes!

---

**Happy Planning! 🎉** Start creating your perfect outings today!
