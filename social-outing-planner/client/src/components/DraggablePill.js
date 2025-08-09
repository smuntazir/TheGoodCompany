import React from 'react';
import styled from 'styled-components';
import { MapPin, Activity, X, Clock, MapPinIcon } from 'lucide-react';

const PillContainer = styled.div`
  background: ${props => props.type === 'poi' ? 
    'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' : 
    'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
  };
  border: 2px solid ${props => props.type === 'poi' ? '#2196f3' : '#9c27b0'};
  border-radius: 25px;
  padding: 12px 16px;
  margin-bottom: 10px;
  cursor: grab;
  transition: all 0.2s;
  position: relative;
  user-select: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const PillHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const PillTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: ${props => props.type === 'poi' ? '#1976d2' : '#7b1fa2'};
  font-size: 14px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 0, 0, 0.1);
    color: #f44336;
  }
`;

const PillDescription = styled.div`
  font-size: 12px;
  color: ${props => props.type === 'poi' ? '#1565c0' : '#6a1b9a'};
  margin-top: 5px;
  opacity: 0.8;
`;

const PillMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  font-size: 11px;
  color: ${props => props.type === 'poi' ? '#1565c0' : '#6a1b9a'};
  opacity: 0.7;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DraggablePill = ({ item, type, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleDragStart = (e) => {
    // Store the item data for the drop handler
    e.dataTransfer.setData('application/json', JSON.stringify({
      item,
      type
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <PillContainer 
      type={type}
      draggable={true}
      onDragStart={handleDragStart}
    >
      <PillHeader>
        <PillTitle type={type}>
          {type === 'poi' ? <MapPin size={16} /> : <Activity size={16} />}
          {item.name}
        </PillTitle>
        <DeleteButton onClick={handleDelete}>
          <X size={14} />
        </DeleteButton>
      </PillHeader>
      
      {item.description && (
        <PillDescription type={type}>
          {item.description}
        </PillDescription>
      )}
      
      <PillMeta type={type}>
        {type === 'poi' && item.location && (
          <MetaItem>
            <MapPinIcon size={10} />
            {item.location}
          </MetaItem>
        )}
        {type === 'aoi' && item.duration && (
          <MetaItem>
            <Clock size={10} />
            {item.duration} min
          </MetaItem>
        )}
        {item.category && (
          <MetaItem>
            #{item.category}
          </MetaItem>
        )}
      </PillMeta>
    </PillContainer>
  );
};

export default DraggablePill;
