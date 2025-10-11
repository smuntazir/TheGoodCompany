import React, { useState } from 'react';
import styled from 'styled-components';
import { LogOut, Plus, MapPin, Activity, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

import POIForm from './POIForm';
import AOIForm from './AOIForm';
import DraggablePill from './DraggablePill';
import TimePickerModal from './TimePickerModal';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

const Sidebar = styled.div`
  width: 380px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 32px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #000000;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
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
`;

const ListContainer = styled.div`
  min-height: 120px;
  padding: 16px;
  border: 1px dashed #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #f0f0f0;
  max-width: 1200px;
  margin: 0 auto;
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
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${props => props.$isToday ? '#000000' : '#333333'};
  margin-bottom: 8px;
  font-size: 14px;
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
      <Sidebar>
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
