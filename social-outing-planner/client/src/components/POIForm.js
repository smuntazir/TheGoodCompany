import React, { useState } from 'react';
import styled from 'styled-components';
import { X, MapPin, FileText, Tag, Navigation } from 'lucide-react';

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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: ${props => props.textarea ? '40px' : '36px'};
  color: #999;
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
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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

const POIForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <MapPin size={24} color="#2196f3" />
            Add Place of Interest
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Place Name *</Label>
            <InputIcon>
              <MapPin size={16} />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="e.g., Central Park, Local Coffee Shop"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Location</Label>
            <InputIcon>
              <Navigation size={16} />
            </InputIcon>
            <Input
              type="text"
              name="location"
              placeholder="e.g., New York, NY or 123 Main St"
              value={formData.location}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Category</Label>
            <InputIcon>
              <Tag size={16} />
            </InputIcon>
            <Input
              type="text"
              name="category"
              placeholder="e.g., restaurant, park, museum"
              value={formData.category}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Description</Label>
            <InputIcon textarea>
              <FileText size={16} />
            </InputIcon>
            <TextArea
              name="description"
              placeholder="What makes this place special? Why do you want to visit?"
              value={formData.description}
              onChange={handleChange}
            />
          </InputGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" primary>
              Add Place
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default POIForm;
