import React, { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

interface CreateChatRoomProps {
  onClose: () => void;
}

export function CreateChatRoom({ onClose }: CreateChatRoomProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold mb-4">Create New Chatroom</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Room Name</span>
            </label>
            <input
              type="text"
              placeholder="Room Name"
              className="input input-bordered w-full"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}