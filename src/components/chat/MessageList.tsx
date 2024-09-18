import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { ref, onChildAdded, off, update } from 'firebase/database';
import { Avatar } from '../ui/Avatar';
import { Message } from '../../types';
import { EmojiPicker } from '../ui/EmojiPicker';
import { Button } from '../ui/Button';

export const MessageList: React.FC = () => {
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
      setMessages((prev) => [...prev, { id: snapshot.key!, ...message }]);
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, 'child_added', handleNewMessage);
      setMessages([]);
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
      } else if (updatedReactions[emoji].includes(user.uid)) {
        updatedReactions[emoji] = updatedReactions[emoji].filter((id) => id !== user.uid);
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        updatedReactions[emoji].push(user.uid);
      }

      await update(messageRef, { reactions: updatedReactions });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`relative flex ${
            message.userId === user?.uid ? 'justify-end' : 'justify-start'
          }`}
          onClick={() => setSelectedMessage(message.id)}
        >
          <div className="flex items-start max-w-[75%] space-x-2">
            {message.userId !== user?.uid && (
              <Avatar seed={message.userName} size="small" />
            )}
            <div
              className={`px-4 py-2 rounded-lg ${
                message.userId === user?.uid
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.userId !== user?.uid && (
                <p className="font-bold text-sm">{message.userName}</p>
              )}
              <p className="break-words">{message.text}</p>
              {message.fileURL && (
                message.fileType?.startsWith('image/') ? (
                  <img src={message.fileURL} alt="Shared image" className="mt-2 max-w-full rounded" />
                ) : (
                  <a href={message.fileURL} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm underline">
                    Download file
                  </a>
                )
              )}
              <p className="text-xs text-right mt-1 text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
              <div className="flex flex-wrap mt-2">
                {Object.entries(message.reactions || {}).map(([emoji, users]) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReaction(message.id, emoji);
                    }}
                    className={`mr-1 mb-1 ${users.includes(user!.uid) ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    {emoji} {users.length}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {selectedMessage === message.id && (
            <div className="absolute z-10 bottom-0 left-0 bg-background p-2 rounded-lg shadow-lg">
              <EmojiPicker
                onEmojiSelect={(emoji: string) => {
                  handleReaction(message.id, emoji);
                  setSelectedMessage(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
