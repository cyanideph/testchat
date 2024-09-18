import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreateChatRoomProps {
  onClose: () => void;
}

export const CreateChatRoom: React.FC<CreateChatRoomProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const database = getDatabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      const roomRef = ref(database, `rooms/${roomName}`);
      await set(roomRef, { createdAt: Date.now() });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary">CREATE NEW CHATROOM</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark"
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="secondary" className="text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-dark dark:bg-primary-dark dark:hover:bg-primary-darker">
              Create Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
