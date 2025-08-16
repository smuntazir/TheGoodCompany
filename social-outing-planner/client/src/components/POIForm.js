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
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
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
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #000000;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 42px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 14px 14px 42px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  font-size: 16px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #000000;
    background: #ffffff;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: ${props => props.$textarea ? '42px' : '38px'};
  color: #999999;
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
  
  ${props => props.$primary ? `
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
            <MapPin size={24} color="#000000" />
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
            <InputIcon $textarea>
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
            <Button type="submit" $primary>
              Add Place
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default POIForm;
