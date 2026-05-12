import React from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock } from 'lucide-react';

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
  word-break: break-word;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: #f8f8f8;
    color: #000000;
  }
`;

const EventInfo = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #666666;
  font-size: 13px;
  font-weight: 600;
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: #000000;
  font-size: 14px;
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
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

  ${props => props.$destructive ? `
    background: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }
  ` : `
    background: #f8f8f8;
    color: #000000;
    border: 1px solid #e8e8e8;

    &:hover {
      background: #f0f0f0;
    }
  `}
`;

const EventDetailModal = ({ event, onEdit, onDelete, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isShared = event.sharedWith && event.sharedWith.length > 0;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{event.title}</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <EventInfo>
          <InfoRow>
            <InfoLabel>
              <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
              Date
            </InfoLabel>
            <InfoValue>{formatDate(event.date)}</InfoValue>
          </InfoRow>

          {(event.startTime || event.endTime) && (
            <InfoRow>
              <InfoLabel>
                <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                Time
              </InfoLabel>
              <InfoValue>
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </InfoValue>
            </InfoRow>
          )}

          {event.category && (
            <InfoRow>
              <InfoLabel>Category</InfoLabel>
              <InfoValue style={{ textTransform: 'capitalize' }}>{event.category}</InfoValue>
            </InfoRow>
          )}

          {event.type && (
            <InfoRow>
              <InfoLabel>Type</InfoLabel>
              <InfoValue style={{ textTransform: 'capitalize' }}>{event.type}</InfoValue>
            </InfoRow>
          )}

          {event.location && (
            <InfoRow>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{event.location}</InfoValue>
            </InfoRow>
          )}

          {event.description && (
            <InfoRow>
              <InfoLabel>Notes</InfoLabel>
              <InfoValue>{event.description}</InfoValue>
            </InfoRow>
          )}

          {isShared && (
            <InfoRow>
              <InfoLabel>Shared With</InfoLabel>
              <InfoValue>{event.sharedWith.length} user(s)</InfoValue>
            </InfoRow>
          )}

          {isShared && event.createdBy && (
            <InfoRow>
              <InfoLabel>Creator</InfoLabel>
              <InfoValue>{event.createdBy}</InfoValue>
            </InfoRow>
          )}
        </EventInfo>

        <ButtonGroup>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onEdit(event)}>
            Edit
          </Button>
          <Button type="button" $destructive onClick={() => onDelete(event)}>
            Delete
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default EventDetailModal;
