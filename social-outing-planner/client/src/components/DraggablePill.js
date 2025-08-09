import React from 'react';
import styled from 'styled-components';
import { MapPin, Activity, X, Clock, MapPinIcon } from 'lucide-react';

const PillContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
  
  &:hover {
    transform: translateY(-1px);
    border-color: #d0d0d0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  gap: 10px;
  font-weight: 600;
  color: #000000;
  font-size: 14px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
    color: #666666;
  }
`;

const PillDescription = styled.div`
  font-size: 12px;
  color: #666666;
  margin-top: 8px;
  opacity: 0.8;
  line-height: 1.4;
`;

const PillMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  font-size: 11px;
  color: #888888;
  opacity: 0.8;
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
          {type === 'poi' ? <MapPin size={16} color="#666666" /> : <Activity size={16} color="#666666" />}
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
