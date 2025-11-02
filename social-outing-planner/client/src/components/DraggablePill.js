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
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 8px;
    border-radius: 8px;
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
  
  @media (max-width: 768px) {
    font-size: 13px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    gap: 6px;
  }
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
  
  @media (max-width: 480px) {
    padding: 2px;
  }
`;

const PillDescription = styled.div`
  font-size: 12px;
  color: #666666;
  margin-top: 8px;
  opacity: 0.8;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    margin-top: 4px;
  }
`;

const PillMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  font-size: 11px;
  color: #888888;
  opacity: 0.8;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    font-size: 10px;
    gap: 8px;
    margin-top: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    gap: 6px;
    margin-top: 4px;
  }
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
    const dragData = {
      item,
      type
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    // Also store in global window for touch fallback
    window.touchDragData = dragData;
  };

  const handleTouchStart = (e) => {
    // Store drag data globally for touch events
    window.touchDragData = { item, type };
  };

  return (
    <PillContainer 
      type={type}
      draggable={true}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
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
