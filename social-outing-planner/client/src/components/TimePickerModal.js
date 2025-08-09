import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Clock, Calendar, Save } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const TimeInput = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const EventInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const EventTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const EventDate = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const TimePickerModal = ({ event, onSave, onClose }) => {
  const [startTime, setStartTime] = useState(event.startTime || '09:00');
  const [endTime, setEndTime] = useState(event.endTime || '10:00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...event,
      startTime,
      endTime
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Clock size={24} color="#667eea" />
            Schedule Event
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <EventInfo>
          <EventTitle>{event.title}</EventTitle>
          <EventDate>
            <Calendar size={16} />
            {formatDate(event.date)}
          </EventDate>
        </EventInfo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Start Time</Label>
            <TimeInput
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>End Time</Label>
            <TimeInput
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </InputGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" primary>
              <Save size={16} />
              Schedule Event
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default TimePickerModal;
