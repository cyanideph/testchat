import React, { useState, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { database, storage } from '../../services/firebase';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmojiPicker } from '../ui/EmojiPicker';
import { Smile, Paperclip, Send } from 'lucide-react';

export function MessageInput() {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'accent'>('primary');
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
      userAvatar: user.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`,
      timestamp: Date.now(),
      fileURL,
      fileType,
      reactions: {},
      type: messageType,
    });

    setNewMessage('');
    setMessageType('primary'); // Reset to default type
    fileInputRef.current!.value = ''; // Reset file input
  };

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-4 bg-base-200">
      {/* Emoji Picker positioned above the input */}
      {showEmojiPicker && (
        <div className="absolute top-[-200%] mb-2 z-10 w-full">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
      <div className="join w-full">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-bordered join-item w-full"
          aria-label="Message input"
        />
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value as 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' | 'accent')}
          className="select select-bordered join-item"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="accent">Accent</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button type="button" className="btn join-item" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          aria-label="File upload"
        />
        <button type="button" className="btn join-item" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="h-5 w-5" />
        </button>
        <button type="submit" className="btn join-item">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
