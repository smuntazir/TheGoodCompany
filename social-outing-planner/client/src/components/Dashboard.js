import React, { useState } from 'react';
import styled from 'styled-components';
import { LogOut, Plus, MapPin, Activity, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users, Sparkles } from 'lucide-react';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

import POIForm from './POIForm';
import AOIForm from './AOIForm';
import DraggablePill from './DraggablePill';
import TimePickerModal from './TimePickerModal';
import AIChat from './AIChat';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 380px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    max-height: ${props => props.$isOpen ? '60vh' : '0'};
    overflow-y: ${props => props.$isOpen ? 'auto' : 'hidden'};
    overflow-x: hidden;
    transition: max-height 0.3s ease;
  }
`;

const SidebarToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background-color: #f8f8f8;
    color: #000000;
  }
`;

const Header = styled.div`
  padding: 32px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const Logo = styled.h1`
  color: #000000;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
    color: #000000;
  }
`;

const Section = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const SectionTitle = styled.h2`
  color: #000000;
  font-size: 1.125rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    gap: 6px;
    margin-bottom: 12px;
  }
`;

const AddButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333333;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
    margin-bottom: 12px;
    gap: 6px;
  }
`;

const ListContainer = styled.div`
  min-height: 120px;
  padding: 16px;
  border: 1px dashed #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  
  @media (max-width: 768px) {
    min-height: 100px;
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    min-height: 80px;
    padding: 8px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #f0f0f0;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const CalendarTitle = styled.h1`
  color: #000000;
  font-size: 2.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 8px;
  }
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  color: #666666;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
    border-color: #000000;
    color: #000000;
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-top: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin-top: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 12px;
  }
`;

const DayCell = styled.div`
  min-height: 140px;
  border: none;
  padding: 12px;
  background: ${props => props.$isToday ? '#f8f8f8' : 'white'};
  position: relative;
  transition: all 0.2s ease;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  
  &:nth-child(7n) {
    border-right: none;
  }
  
  &:hover {
    background: #fafafa;
  }
  
  &.drag-over {
    background: #f0f0f0;
    transform: scale(1.01);
  }
  
  @media (max-width: 768px) {
    min-height: 100px;
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    min-height: 80px;
    padding: 6px;
  }
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${props => props.$isToday ? '#000000' : '#333333'};
  margin-bottom: 8px;
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EventPill = styled.div`
  background: ${props => props.$isShared ? '#e8f4fd' : (props.type === 'poi' ? '#f0f0f0' : '#f8f8f8')};
  color: ${props => props.type === 'poi' ? '#000000' : '#333333'};
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid ${props => props.$isShared ? '#b3d9f2' : (props.type === 'poi' ? '#e0e0e0' : '#e8e8e8')};
  
  &:hover {
    background: ${props => props.$isShared ? '#d6eaf8' : (props.type === 'poi' ? '#e8e8e8' : '#f0f0f0')};
  }
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 9px;
    gap: 2px;
  }
`;

const TimeDisplay = styled.span`
  font-size: 10px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const EventHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const SharedIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 9px;
  opacity: 0.8;
  color: #0066cc;
`;

const Dashboard = ({ 
  user, 
  pois, 
  aois, 
  events, 
  onAddPOI, 
  onAddAOI, 
  onAddEvent,
  onDeletePOI, 
  onDeleteAOI, 
  onDeleteEvent, 
  onLogout 
}) => {
  const [showPOIForm, setShowPOIForm] = useState(false);
  const [showAOIForm, setShowAOIForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day) => {
    return events.filter(event => {
      // Parse event date as local date to avoid timezone issues
      // Split 'yyyy-MM-dd' and create local Date object
      const [year, month, dayNum] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, dayNum);
      const dayDate = new Date(day);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };



  const handleTimePickerSave = async (eventWithTime) => {
    await onAddEvent(eventWithTime);
    setShowTimePicker(false);
    setPendingEvent(null);
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    setDragOverDay(null);
    
    try {
      let dragData = null;
      
      // Try to get data from dataTransfer (mouse/desktop)
      try {
        dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      } catch {
        // Fallback: check if we have touch drag data stored globally
        if (window.touchDragData) {
          dragData = window.touchDragData;
          window.touchDragData = null; // Clear after use
        }
      }
      
      if (!dragData) {
        console.warn('No drag data found');
        return;
      }
      
      const { item, type } = dragData;
      
      // Create a new event from the dropped item
      const newEvent = {
        title: item.name,
        description: item.description || '',
        type: type,
        date: format(day, 'yyyy-MM-dd'),
        location: type === 'poi' ? item.location : undefined,
        duration: type === 'aoi' ? item.duration : undefined,
        category: item.category
      };
      
      // Show time picker for the new event
      setPendingEvent(newEvent);
      setShowTimePicker(true);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e, day) => {
    e.preventDefault();
    setDragOverDay(format(day, 'yyyy-MM-dd'));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear drag over if we're leaving the day cell entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay(null);
    }
  };

  const renderCalendarDay = (day, index) => {
    const dayEvents = getEventsForDay(day);
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
    const dayKey = format(day, 'yyyy-MM-dd');
    const isDragOver = dragOverDay === dayKey;

    return (
      <DayCell
        key={index}
        $isToday={isToday}
        className={isDragOver ? 'drag-over' : ''}
        onDrop={(e) => handleDrop(e, day)}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, day)}
        onDragLeave={handleDragLeave}
        style={{
          backgroundColor: isToday ? '#f0f4ff' : 'white',
          opacity: isCurrentMonth ? 1 : 0.3
        }}
      >
        <DayNumber $isToday={isToday}>
          {format(day, 'd')}
        </DayNumber>
        <EventsContainer>
          {dayEvents.map((event, eventIndex) => {
            const isShared = event.sharedWith && event.sharedWith.length > 0;
            return (
              <EventPill
                key={event._id}
                type={event.type}
                $isShared={isShared}
                onClick={() => onDeleteEvent(event._id)}
                title={isShared ? `Shared event by ${event.createdBy || 'Unknown'}. Click to remove` : 'Click to remove'}
              >
                <EventHeader>
                  <div>{event.title}</div>
                  {isShared && (
                    <SharedIndicator title={`Shared with ${event.sharedWith.length} user(s)`}>
                      <Users size={10} />
                    </SharedIndicator>
                  )}
                </EventHeader>
                {event.startTime && (
                  <TimeDisplay>
                    <Clock size={8} />
                    {event.startTime}
                    {event.endTime && ` - ${event.endTime}`}
                  </TimeDisplay>
                )}
                {isShared && event.createdBy && (
                  <TimeDisplay style={{ fontSize: '9px' }}>
                    by {event.createdBy}
                  </TimeDisplay>
                )}
              </EventPill>
            );
          })}
        </EventsContainer>
      </DayCell>
    );
  };

  return (
    <DashboardContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <Header>
          <Logo>Good Company</Logo>
          <LogoutButton onClick={onLogout}>
            <LogOut size={20} />
          </LogoutButton>
        </Header>

        <Section>
          <SectionTitle>
            <MapPin size={20} />
            Places of Interest
          </SectionTitle>
          <AddButton onClick={() => setShowPOIForm(true)}>
            <Plus size={16} />
            Add Place
          </AddButton>
          
          <ListContainer>
            {pois.map((poi, index) => (
              <DraggablePill
                key={poi._id}
                item={poi}
                type="poi"
                onDelete={() => onDeletePOI(poi._id)}
              />
            ))}
          </ListContainer>
        </Section>

        <Section>
          <SectionTitle>
            <Activity size={20} />
            Activities of Interest
          </SectionTitle>
          <AddButton onClick={() => setShowAOIForm(true)}>
            <Plus size={16} />
            Add Activity
          </AddButton>
          
          <ListContainer>
            {aois.map((aoi, index) => (
              <DraggablePill
                key={aoi._id}
                item={aoi}
                type="aoi"
                onDelete={() => onDeleteAOI(aoi._id)}
              />
            ))}
          </ListContainer>
        </Section>

        <Section>
          <SectionTitle>
            <Sparkles size={20} />
            AI Brainstorming
          </SectionTitle>
          <AIChat onAddPOI={onAddPOI} onAddAOI={onAddAOI} />
        </Section>
      </Sidebar>

      <MainContent>
        <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕ Close' : '☰ Menu'}
        </SidebarToggle>
        <CalendarContainer>
          <CalendarHeader>
            <CalendarTitle>
              <CalendarIcon size={32} color="#667eea" />
              {format(currentDate, 'MMMM yyyy')}
            </CalendarTitle>
            <NavControls>
              <NavButton onClick={() => navigateMonth('prev')}>
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton onClick={() => navigateMonth('next')}>
                <ChevronRight size={20} />
              </NavButton>
            </NavControls>
          </CalendarHeader>
          
          <MonthGrid>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px', color: '#666' }}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => renderCalendarDay(day, index))}
          </MonthGrid>
        </CalendarContainer>
      </MainContent>

      {showPOIForm && (
        <POIForm
          onSubmit={(data) => {
            onAddPOI(data);
            setShowPOIForm(false);
          }}
          onClose={() => setShowPOIForm(false)}
        />
      )}

      {showAOIForm && (
        <AOIForm
          onSubmit={(data) => {
            onAddAOI(data);
            setShowAOIForm(false);
          }}
          onClose={() => setShowAOIForm(false)}
        />
      )}

      {showTimePicker && pendingEvent && (
        <TimePickerModal
          event={pendingEvent}
          onSave={handleTimePickerSave}
          onClose={() => {
            setShowTimePicker(false);
            setPendingEvent(null);
          }}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
