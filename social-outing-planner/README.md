# OutingPlan - Social Outing Planner 🗺️

A modern social webapp for planning outings with friends. Create lists of Places of Interest (POIs) and Activities of Interest (AOIs), then drag them onto your calendar to schedule the perfect outing!

## Features ✨

- **Places of Interest (POIs)**: Add places you want to visit with descriptions, locations, and categories
- **Activities of Interest (AOIs)**: Add activities you want to do with duration and category info
- **Drag & Drop Planning**: Drag POIs and AOIs from your lists directly onto calendar dates
- **Interactive Calendar**: Visual monthly calendar with scheduled events
- **User Authentication**: Secure login and registration system
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Instant feedback with toast notifications

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

## Usage Guide 📱

1. **Register/Login**: Create an account or sign in
2. **Add POIs**: Click "Add Place" to create Places of Interest
3. **Add AOIs**: Click "Add Activity" to create Activities of Interest
4. **Plan Your Outing**: Drag POIs and AOIs from the sidebar onto calendar dates
5. **Manage Events**: Click on scheduled events to remove them

## Project Structure 📁

```
social-outing-planner/
├── app.py                # Python Flask backend server
├── requirements.txt      # Python dependencies
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

## Future Enhancements 🚀

- Social features (friend system, shared outings)
- Map integration for POI visualization
- Weather integration for outdoor activities
- Collaborative planning with multiple users
- Mobile app version
- Export to external calendars
- Activity recommendations based on preferences

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
