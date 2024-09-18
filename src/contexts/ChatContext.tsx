import React, { createContext, useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Room, User } from '../types';

interface ChatContextType {
  rooms: Room[];
  users: User[];
  currentRoom: Room | null;
  setCurrentRoom: (room: Room) => void;
}

export const ChatContext = createContext<ChatContextType>({
  rooms: [],
  users: [],
  currentRoom: null,
  setCurrentRoom: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'rooms');
    const usersRef = ref(db, 'users');

    const unsubscribeRooms = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data).map(([id, room]: [string, any]) => ({
          id,
          name: id,
          ...room,
        }));
        setRooms(roomList);
      }
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([id, user]: [string, any]) => ({
          id,
          ...user,
        }));
        setUsers(userList);
      }
    });

    return () => {
      unsubscribeRooms();
      unsubscribeUsers();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ rooms, users, currentRoom, setCurrentRoom }}>
      {children}
    </ChatContext.Provider>
  );
};
