import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';

export const ChatRoom: React.FC = () => {
  const { currentRoom } = useChat();

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-xl text-primary bg-background">
        Select a chatroom to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 bg-primary text-primary-foreground">
        <h2 className="text-xl font-bold">#{currentRoom.name}</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <MessageList />
      </div>
      <div className="p-4 border-t border-gray-700">
        <MessageInput />
      </div>
    </div>
  );
};
