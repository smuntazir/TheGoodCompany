import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Activity, FileText, Tag, Clock } from 'lucide-react';

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
    border-color: #9c27b0;
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
    border-color: #9c27b0;
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
    background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
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

const AOIForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: ''
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
    
    const submitData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null
    };
    
    onSubmit(submitData);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Activity size={24} color="#9c27b0" />
            Add Activity of Interest
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Activity Name *</Label>
            <InputIcon>
              <Activity size={16} />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="e.g., Hiking, Photography, Board Games"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Duration (minutes)</Label>
            <InputIcon>
              <Clock size={16} />
            </InputIcon>
            <Input
              type="number"
              name="duration"
              placeholder="e.g., 120 for 2 hours"
              value={formData.duration}
              onChange={handleChange}
              min="1"
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
              placeholder="e.g., outdoor, creative, social"
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
              placeholder="What does this activity involve? What makes it interesting?"
              value={formData.description}
              onChange={handleChange}
            />
          </InputGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" primary>
              Add Activity
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default AOIForm;
