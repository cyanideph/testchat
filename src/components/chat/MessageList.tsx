import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { ref, onChildAdded, off, update } from 'firebase/database';
import { Message } from '../../types';
import { EmojiPicker } from '../ui/EmojiPicker';

const colorMap: Record<string, string> = {
  info: 'chat-bubble-info',
  success: 'chat-bubble-success',
  warning: 'chat-bubble-warning',
  error: 'chat-bubble-error',
  primary: 'chat-bubble-primary',
  secondary: 'chat-bubble-secondary',
  accent: 'chat-bubble-accent',
};

export function MessageList() {
  const { currentRoom } = useChat();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRoom) return;

    const messagesRef = ref(database, `messages/${currentRoom.id}`);
    const handleNewMessage = (snapshot: any) => {
      const message = snapshot.val();
      setMessages((prev) => [...prev, { id: snapshot.key!, ...message } as Message]);
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, 'child_added', handleNewMessage);
      setMessages([]); // Clear messages on unmount
    };
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    const messageRef = ref(database, `messages/${currentRoom!.id}/${messageId}`);
    const message = messages.find((m) => m.id === messageId);

    if (message) {
      const updatedReactions = { ...message.reactions };
      if (!updatedReactions[emoji]) {
        updatedReactions[emoji] = [user.uid];
      } else {
        const userIndex = updatedReactions[emoji].indexOf(user.uid);
        if (userIndex > -1) {
          updatedReactions[emoji].splice(userIndex, 1);
          if (updatedReactions[emoji].length === 0) {
            delete updatedReactions[emoji];
          }
        } else {
          updatedReactions[emoji].push(user.uid);
        }
      }

      await update(messageRef, { reactions: updatedReactions });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const colorClass = colorMap[message.type || 'info'] || 'chat-bubble'; // Default to 'info'

        return (
          <div key={message.id} className={`chat ${message.userId === user?.uid ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="ring ring-primary ring-offset-base-100 w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={message.userAvatar || (user ? user.photoURL : '') || `https://api.dicebear.com/6.x/initials/svg?seed=${message.userName}`} 
                  alt={`${message.userName}'s Avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="chat-header">
              {message.userName}
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </time>
            </div>
            <div className={`chat-bubble ${colorClass}`} onClick={() => setSelectedMessage(message.id)}>
              {message.text}
              {message.fileURL && (
                message.fileType?.startsWith('image/') ? (
                  <img src={message.fileURL} alt="Shared image" className="mt-2 max-w-full rounded" />
                ) : (
                  <a href={message.fileURL} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm underline">
                    Download file
                  </a>
                )
              )}
            </div>
            <div className="chat-footer opacity-50">
              {Object.entries(message.reactions || {}).map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReaction(message.id, emoji);
                  }}
                  className={`btn btn-circle btn-xs mr-1 ${users.includes(user!.uid) ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {emoji} {users.length}
                </button>
              ))}
            </div>
            {selectedMessage === message.id && (
              <div className="absolute z-10">
                <EmojiPicker
                  onEmojiSelect={(emoji: string) => {
                    handleReaction(message.id, emoji);
                    setSelectedMessage(null);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
