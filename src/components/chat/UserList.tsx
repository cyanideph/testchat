import React from 'react';
import { useChat } from '../../hooks/useChat';
import { User } from '../../types';

export const UserList: React.FC = () => {
  const { users } = useChat();

  return (
    <ul className="space-y-2">
      {users.map((user: User) => (
        <li key={user.id} className="flex items-center space-x-2 p-2 bg-dark-800 rounded-md">
          <span className="flex-1 text-white">{user.displayName || user.email}</span>
          <span
            className={`w-3 h-3 rounded-full ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          ></span>
        </li>
      ))}
    </ul>
  );
};