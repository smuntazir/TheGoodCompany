import React, { useState } from 'react';
import styled from 'styled-components';
import { UserPlus, Users, Check, X, Send } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubHeader = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SendButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f8f8;
  border-radius: 8px;
  font-size: 14px;
`;

const Username = styled.span`
  font-weight: 500;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  background: ${props => props.$type === 'accept' ? '#e6f4ea' : '#fce8e6'};
  color: ${props => props.$type === 'accept' ? '#1e7e34' : '#d93025'};
  border: none;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    filter: brightness(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  font-size: 0.8rem;
  padding: 8px;
  font-style: italic;
`;

const FriendsSection = ({
  friends = [],
  requests = [],
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend
}) => {
  const [username, setUsername] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!username.trim()) return;
    setSending(true);
    await onSendRequest(username);
    setSending(false);
    setUsername('');
  };

  return (
    <Container>
      {/* Add Friend */}
      <div>
        <SubHeader>Add Friend</SubHeader>
        <InputGroup>
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <SendButton onClick={handleSend} disabled={!username.trim() || sending}>
            {sending ? <div className="spinner" /> : <Send size={16} />}
          </SendButton>
        </InputGroup>
      </div>

      {/* Friend Requests */}
      <div>
        <SubHeader>
          Requests
          {requests.length > 0 && <span style={{ fontSize: '0.8rem', background: '#ffebee', color: '#c62828', padding: '2px 6px', borderRadius: '10px' }}>{requests.length}</span>}
        </SubHeader>
        {requests.length === 0 ? (
          <EmptyState>No pending requests</EmptyState>
        ) : (
          <List>
            {requests.map((req, i) => (
              <ListItem key={i}>
                <Username>{req.username}</Username>
                <Actions>
                  <ActionButton $type="accept" onClick={() => onAcceptRequest(req.username)} title="Accept">
                    <Check size={14} />
                  </ActionButton>
                  <ActionButton $type="reject" onClick={() => onRejectRequest(req.username)} title="Delete">
                    <X size={14} />
                  </ActionButton>
                </Actions>
              </ListItem>
            ))}
          </List>
        )}
      </div>

      {/* Friends List */}
      <div>
        <SubHeader>My Friends ({friends.length})</SubHeader>
        {friends.length === 0 ? (
          <EmptyState>No friends yet</EmptyState>
        ) : (
          <List>
            {friends.map((friend, i) => (
              <ListItem key={i}>
                <Username>{friend.username}</Username>
                <Actions>
                  <ActionButton $type="reject" onClick={() => onRemoveFriend(friend.username)} title="Remove Friend">
                    <X size={14} />
                  </ActionButton>
                </Actions>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
};

export default FriendsSection;
