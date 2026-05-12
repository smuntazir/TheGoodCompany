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
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [poisRes, aoisRes, eventsRes, friendsRes, requestsRes] = await Promise.all([
        axios.get('/api/pois'),
        axios.get('/api/aois'),
        axios.get('/api/events'),
        axios.get('/api/friends/list'),
        axios.get('/api/friends/requests')
      ]);

      setPois(poisRes.data);
      setAois(aoisRes.data);
      setEvents(eventsRes.data);
      setFriends(friendsRes.data);
      setFriendRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't auto-logout on partial errors, or check if it's 401
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    fetchUserData();
    toast.success('Welcome back!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setPois([]);
    setAois([]);
    setEvents([]);
    setFriends([]);
    setFriendRequests([]);
    toast.info('Logged out successfully');
  };

  const sendFriendRequest = async (username) => {
    try {
      await axios.post('/api/friends/request', { username });
      toast.success('Friend request sent');
      // No UI update needed for sender as per requirements (silent fail/success)
    } catch (error) {
      // Silent fail
      console.error(error);
      toast.success('Friend request sent'); // Pretend success for privacy
    }
  };

  const acceptFriendRequest = async (username) => {
    try {
      await axios.post('/api/friends/accept', { username });
      toast.success(`You are now friends with ${username}`);
      // Refresh list
      const [friendsRes, requestsRes] = await Promise.all([
        axios.get('/api/friends/list'),
        axios.get('/api/friends/requests')
      ]);
      setFriends(friendsRes.data);
      setFriendRequests(requestsRes.data);
    } catch (error) {
      toast.error('Error accepting friend');
    }
  };

  const rejectFriendRequest = async (username) => {
    try {
      await axios.post('/api/friends/reject', { username });
      toast.info('Request removed');
      // Refresh requests
      const res = await axios.get('/api/friends/requests');
      setFriendRequests(res.data);
    } catch (error) {
      toast.error('Error removing request');
    }
  };

  const removeFriend = async (username) => {
    try {
      await axios.post('/api/friends/remove', { username });
      toast.info('Friend removed');
      // Refresh list
      const friendsRes = await axios.get('/api/friends/list');
      setFriends(friendsRes.data);
    } catch (error) {
      toast.error('Error removing friend');
    }
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

  const deletingIds = React.useRef(new Set());

  const deleteEvent = async (id) => {
    if (deletingIds.current.has(id)) return;
    deletingIds.current.add(id);
    
    console.log('deleteEvent called for ID:', id);
    try {
      await axios.delete(`/api/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      toast.success('Event removed');
    } catch (error) {
      console.error('Error deleting event:', id, error.response?.status, error.response?.data);
      if (error.response?.status === 403) {
        toast.error('Only the event creator can delete this event');
      } else if (error.response?.status !== 404) {
        // Only show error if it's not a 404 (which we might get from race conditions)
        toast.error(error.response?.data?.error || 'Error removing event');
      }
    } finally {
      deletingIds.current.delete(id);
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
                  friends={friends}
                  friendRequests={friendRequests}
                  onAddPOI={addPOI}
                  onAddAOI={addAOI}
                  onAddEvent={addEvent}
                  onDeletePOI={deletePOI}
                  onDeleteAOI={deleteAOI}
                  onDeleteEvent={deleteEvent}
                  onLogout={handleLogout}
                  onSendRequest={sendFriendRequest}
                  onAcceptRequest={acceptFriendRequest}
                  onRejectRequest={rejectFriendRequest}
                  onRemoveFriend={removeFriend}
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
