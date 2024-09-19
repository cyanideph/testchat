import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../hooks/useChat';
import { VoiceMessage } from './VoiceMessage';
import { CreatePoll } from './CreatePoll';

export function ChatRoom() {
  const { currentRoom } = useChat();
  const [showVoiceMessage, setShowVoiceMessage] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  if (!currentRoom) {
    return (
      <div className="h-full flex items-center justify-center text-xl">
        Select a chatroom to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-base-200 shadow-md">
        <h2 className="text-xl font-bold">#{currentRoom.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList />
      </div>
      <div className="mt-auto">
        <div className="flex justify-end space-x-2 p-2">
          <button
            className="btn btn-circle btn-sm transition-transform duration-300 transform hover:scale-110"
            onClick={() => setShowVoiceMessage(true)}
          >
            🎤
          </button>
          <button
            className="btn btn-circle btn-sm transition-transform duration-300 transform hover:scale-110"
            onClick={() => setShowCreatePoll(true)}
          >
            📊
          </button>
        </div>
        <MessageInput />
      </div>
      {showVoiceMessage && (
        <VoiceMessage onClose={() => setShowVoiceMessage(false)} />
      )}
      {showCreatePoll && (
        <CreatePoll onClose={() => setShowCreatePoll(false)} />
      )}
    </div>
  );
}
