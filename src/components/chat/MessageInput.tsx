import React, { useState, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { database, storage } from '../../services/firebase';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { EmojiPicker } from '../ui/EmojiPicker';
import { Smile, Paperclip, Send } from 'lucide-react';

export const MessageInput: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentRoom } = useChat();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom || !user) return;

    const messagesRef = ref(database, `messages/${currentRoom.id}`);
    let fileURL = '';
    let fileType = '';

    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      const fileRef = storageRef(storage, `chat_files/${currentRoom.id}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
      fileType = file.type;
    }

    await push(messagesRef, {
      text: newMessage,
      userId: user.uid,
      userName: user.displayName || user.email,
      timestamp: Date.now(),
      fileURL,
      fileType,
      reactions: {},
    });

    setNewMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-background border-t border-border">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </Button>
        <Button type="submit" size="icon" className="bg-violet-600 hover:bg-violet-700">
          <Send className="h-5 w-5 text-white" />
        </Button>
      </div>
      {showEmojiPicker && (
        <div className="relative mt-2">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </form>
  );
};
