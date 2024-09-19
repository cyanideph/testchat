import React, { createContext, useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Room } from '../types';

interface ChatContextType {
  rooms: Room[];
  currentRoom: Room | null;
  setCurrentRoom: (room: Room) => void;
  loading: boolean; // Add loading state
}

export const ChatContext = createContext<ChatContextType>({
  rooms: [],
  currentRoom: null,
  setCurrentRoom: () => {},
  loading: true, // Initialize loading state
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading

  useEffect(() => {
    const database = getDatabase();
    const roomsRef = ref(database, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      const roomsList = Object.entries(roomsData || {}).map(([id, room]: [string, any]) => ({
        id,
        ...room,
      }));
      setRooms(roomsList);
      setLoading(false); // Set loading to false after data is fetched
    });

    return () => unsubscribe();
  }, []);

  return (
    <ChatContext.Provider value={{ rooms, currentRoom, setCurrentRoom, loading }}>
      {children}
    </ChatContext.Provider>
  );
};
