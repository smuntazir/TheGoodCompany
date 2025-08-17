import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pois, setPois] = useState([]);
  const [aois, setAois] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [poisRes, aoisRes, eventsRes] = await Promise.all([
        axios.get('/api/pois'),
        axios.get('/api/aois'),
        axios.get('/api/events')
      ]);
      
      setPois(poisRes.data);
      setAois(aoisRes.data);
      setEvents(eventsRes.data);
      setUser({ token: localStorage.getItem('token') });
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    fetchUserData();
    toast.success('Welcome back!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setPois([]);
    setAois([]);
    setEvents([]);
    toast.info('Logged out successfully');
  };

  const addPOI = async (poiData) => {
    try {
      const response = await axios.post('/api/pois', poiData);
      setPois([...pois, response.data]);
      toast.success('Place of Interest added!');
    } catch (error) {
      toast.error('Error adding POI');
    }
  };

  const addAOI = async (aoiData) => {
    try {
      const response = await axios.post('/api/aois', aoiData);
      setAois([...aois, response.data]);
      toast.success('Activity of Interest added!');
    } catch (error) {
      toast.error('Error adding AOI');
    }
  };

  const deletePOI = async (id) => {
    try {
      await axios.delete(`/api/pois/${id}`);
      setPois(pois.filter(poi => poi._id !== id));
      toast.success('POI removed');
    } catch (error) {
      toast.error('Error removing POI');
    }
  };

  const deleteAOI = async (id) => {
    try {
      await axios.delete(`/api/aois/${id}`);
      setAois(aois.filter(aoi => aoi._id !== id));
      toast.success('AOI removed');
    } catch (error) {
      toast.error('Error removing AOI');
    }
  };

  const addEvent = async (eventData) => {
    try {
      const response = await axios.post('/api/events', eventData);
      setEvents([...events, response.data]);
      toast.success('Event scheduled!');
    } catch (error) {
      toast.error('Error scheduling event');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      toast.success('Event removed');
    } catch (error) {
      toast.error('Error removing event');
    }
  };

  const scheduleItem = async (scheduleData) => {
    try {
      const response = await axios.post('/api/schedule', scheduleData);
      setEvents([...events, response.data]);
      toast.success(`${scheduleData.type.toUpperCase()} scheduled!`);
    } catch (error) {
      toast.error(`Error scheduling ${scheduleData.type}`);
    }
  };

  const unscheduleItem = async (type, itemId) => {
    try {
      await axios.delete(`/api/schedule/${type}/${itemId}`);
      setEvents(events.filter(event => !(event.itemId === itemId && event.type === type)));
      toast.success(`${type.toUpperCase()} unscheduled!`);
    } catch (error) {
      toast.error(`Error unscheduling ${type}`);
    }
  };

  // Drag and drop is now handled in Dashboard component

  if (loading) {
    return (
      <AppContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h2 style={{ color: '#000000', fontWeight: '600', fontSize: '1.5rem' }}>Loading...</h2>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  user={user}
                  pois={pois}
                  aois={aois}
                  events={events}
                  onAddPOI={addPOI}
                  onAddAOI={addAOI}
                  onAddEvent={addEvent}
                  onDeletePOI={deletePOI}
                  onDeleteAOI={deleteAOI}
                  onDeleteEvent={deleteEvent}
                  onScheduleItem={scheduleItem}
                  onUnscheduleItem={unscheduleItem}
                  onLogout={handleLogout}
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppContainer>
  );
};

export default App;
