import React, { useState } from 'react';
import styled from 'styled-components';
import { LogOut, Plus, MapPin, Activity, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

import POIForm from './POIForm';
import AOIForm from './AOIForm';
import DraggablePill from './DraggablePill';
import TimePickerModal from './TimePickerModal';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 350px;
  background: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ListContainer = styled.div`
  min-height: 100px;
  padding: 10px;
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  background: #f9f9f9;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const CalendarTitle = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavButton = styled.button`
  background: none;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 20px;
`;

const DayCell = styled.div`
  min-height: 120px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 8px;
  background: ${props => props.$isToday ? '#f0f4ff' : 'white'};
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  }
  
  &.drag-over {
    border: 2px dashed #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: scale(1.02);
  }
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${props => props.$isToday ? '#667eea' : '#333'};
  margin-bottom: 5px;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EventPill = styled.div`
  background: ${props => props.type === 'poi' ? '#e3f2fd' : '#f3e5f5'};
  color: ${props => props.type === 'poi' ? '#1976d2' : '#7b1fa2'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${props => props.type === 'poi' ? '#bbdefb' : '#e1bee7'};
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TimeDisplay = styled.span`
  font-size: 10px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 2px;
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day) => {
    return events.filter(event => {
      // Fix date comparison - use local date string comparison to avoid timezone issues
      const eventDate = new Date(event.date);
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
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
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
          {dayEvents.map((event, eventIndex) => (
            <EventPill
              key={event._id}
              type={event.type}
              onClick={() => onDeleteEvent(event._id)}
              title="Click to remove"
            >
              <div>{event.title}</div>
              {event.startTime && (
                <TimeDisplay>
                  <Clock size={8} />
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </TimeDisplay>
              )}
            </EventPill>
          ))}
        </EventsContainer>
      </DayCell>
    );
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <Header>
          <Logo>OutingPlan</Logo>
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
      </Sidebar>

      <MainContent>
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
