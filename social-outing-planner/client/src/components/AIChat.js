import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Send, Bot, User, Loader } from 'lucide-react';
import axios from 'axios';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 600px;
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 8px;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: ${slideIn} 0.2s ease-out;
`;

const SpinLoader = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$isUser ? '#000000' : '#667eea'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const MessageBubble = styled.div`
  background: ${props => props.$isUser ? '#ffffff' : '#f0f0f0'};
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 85%;
  word-wrap: break-word;
  border: 1px solid ${props => props.$isUser ? '#e0e0e0' : 'transparent'};
  font-size: 14px;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
    max-width: 90%;
  }
`;

const InputContainer = styled.form`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #999;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const SendButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #333333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 20px;
  
  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const ItemPreview = styled.div`
  background: #e8f4fd;
  border: 1px solid #b3d9f2;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 12px;
  
  strong {
    display: block;
    margin-bottom: 4px;
    color: #0066cc;
  }
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const PreviewButton = styled.button`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #b3d9f2;
  
  &.approve {
    background: #0066cc;
    color: white;
    border-color: #0066cc;
    
    &:hover {
      background: #0052a3;
    }
  }
  
  &.reject {
    background: white;
    color: #666;
    
    &:hover {
      background: #f8f8f8;
    }
  }
`;

const ConfigHint = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px;
  margin: 12px;
  font-size: 12px;
  color: #856404;
  line-height: 1.5;
  
  strong {
    display: block;
    margin-bottom: 4px;
  }
`;

const AIChat = ({ onAddPOI, onAddAOI }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [configError, setConfigError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setConfigError(null);

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage]
      }, {
        timeout: 60000 // 60 seconds timeout
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle extracted items for preview
      if (response.data.extracted_items && response.data.extracted_items.length > 0) {
        setPendingItems(response.data.extracted_items);
      }
    } catch (error) {
      console.error('Chat error:', error);

      if (error.response?.status === 503) {
        setConfigError(error.response.data);
      } else if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
        const errorMessage = {
          role: 'assistant',
          content: 'The server took too long to respond. Please try again with a shorter prompt.'
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const errorMessage = {
          role: 'assistant',
          content: error.response?.data?.error || 'Sorry, I encountered an error. Please try again.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveItem = async (item, index) => {
    try {
      if (item.type === 'poi') {
        await onAddPOI(item);
      } else {
        await onAddAOI(item);
      }

      // Remove this item from pending
      setPendingItems(prev => prev.filter((_, i) => i !== index));

      // Add confirmation message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✓ Added "${item.name}" to your ${item.type === 'poi' ? 'Places' : 'Activities'} of Interest!`
      }]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleRejectItem = (index) => {
    setPendingItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ChatContainer>
      {configError ? (
        <ConfigHint>
          <strong>⚙️ AI Assistant Not Configured</strong>
          {configError.hint}
        </ConfigHint>
      ) : null}

      <MessagesContainer>
        {messages.length === 0 && !configError ? (
          <EmptyState>
            <Bot size={48} />
            <p><strong>Start brainstorming!</strong></p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Ask me for ideas about places to visit or activities to try.
            </p>
          </EmptyState>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message key={index}>
                <Avatar $isUser={msg.role === 'user'}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </Avatar>
                <MessageBubble $isUser={msg.role === 'user'}>
                  {msg.content}
                </MessageBubble>
              </Message>
            ))}

            {pendingItems.map((item, index) => (
              <ItemPreview key={index}>
                <strong>{item.type === 'poi' ? '📍 Place' : '🎯 Activity'} Suggestion:</strong>
                <div><strong>{item.name}</strong></div>
                {item.location && <div>📍 {item.location}</div>}
                {item.description && <div>{item.description}</div>}
                {item.duration && <div>⏱️ {item.duration}</div>}
                {item.category && <div>🏷️ {item.category}</div>}

                <PreviewActions>
                  <PreviewButton
                    className="approve"
                    onClick={() => handleApproveItem(item, index)}
                  >
                    ✓ Add to My List
                  </PreviewButton>
                  <PreviewButton
                    className="reject"
                    onClick={() => handleRejectItem(index)}
                  >
                    ✕ Skip
                  </PreviewButton>
                </PreviewActions>
              </ItemPreview>
            ))}

            {isLoading && (
              <Message>
                <Avatar>
                  <SpinLoader size={16} />
                </Avatar>
                <MessageBubble>Thinking...</MessageBubble>
              </Message>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>

      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Ask for activity ideas..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading || !inputValue.trim()}>
          <Send size={18} />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default AIChat;
