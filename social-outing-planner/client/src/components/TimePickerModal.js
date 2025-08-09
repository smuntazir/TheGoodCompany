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
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 420px;
  border: 1px solid #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  color: #000000;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
    color: #000000;
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
  color: #000000;
  font-size: 14px;
`;

const TimeInput = styled.input`
  padding: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #000000;
    background: #ffffff;
  }
`;

const EventInfo = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
`;

const EventTitle = styled.div`
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const EventDate = styled.div`
  color: #666666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => props.primary ? `
    background: #000000;
    color: white;
    
    &:hover {
      background: #333333;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f8f8;
    color: #666666;
    border: 1px solid #e8e8e8;
    
    &:hover {
      background: #f0f0f0;
      color: #000000;
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
            <Clock size={24} color="#000000" />
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
