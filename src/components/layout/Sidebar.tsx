import React, { useState, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { CreateChatRoom } from '../modals/CreateChatRoom';
import { UserProfile } from '../modals/UserProfile';
import { About } from '../modals/About';
import { Plus, User, Info, MessageSquare, Users, Calendar } from 'lucide-react';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ setActiveTab }: SidebarProps) {
  const { rooms, currentRoom, setCurrentRoom, loading } = useChat(); // Assume loading is part of useChat
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [error, setError] = useState('');

  // Validation function to check if the room is valid
  const isValidRoom = (roomId: string) => {
    return rooms.some(room => room.id === roomId);
  };

  // Effect to clear error after a certain duration
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
        <li className="menu-title">
          <span>Navigation</span>
        </li>
        <li>
          <button 
            className="flex items-center space-x-2" 
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="h-5 w-5" /> 
            <span>Chat Rooms</span>
          </button>
        </li>
        <li>
          <button 
            className="flex items-center space-x-2" 
            onClick={() => setActiveTab('community')}
          >
            <Users className="h-5 w-5" /> 
            <span>Community Feed</span>
          </button>
        </li>
        <li>
          <button 
            className="flex items-center space-x-2" 
            onClick={() => setActiveTab('users')}
          >
            <User className="h-5 w-5" /> 
            <span>User Directory</span>
          </button>
        </li>
        <li>
          <button 
            className="flex items-center space-x-2" 
            onClick={() => setActiveTab('events')}
          >
            <Calendar className="h-5 w-5" /> 
            <span>Event Calendar</span>
          </button>
        </li>
        
        <li className="menu-title">
          <span>Chat Rooms</span>
        </li>
        {loading ? (
          <li className="loading">
            Loading chat rooms...
          </li>
        ) : (
          rooms.map((room) => (
            <li key={room.id}>
              <button
                className={`flex items-center space-x-2 ${currentRoom?.id === room.id ? 'active' : ''}`}
                onClick={() => {
                  if (isValidRoom(room.id)) {
                    setCurrentRoom(room);
                    setActiveTab('chat');
                  } else {
                    setError(`Invalid room selected: ${room.name}`);
                  }
                }}
              >
                <span># {room.name}</span>
              </button>
            </li>
          ))
        )}
        {error && <li className="text-red-500">{error}</li>}
        <li className="menu-title">
          <span>Actions</span>
        </li>
        <li>
          <button className="flex items-center space-x-2" onClick={() => setShowCreateRoom(true)}>
            <Plus className="h-5 w-5" />
            <span>Create Room</span>
          </button>
        </li>
        <li>
          <button className="flex items-center space-x-2" onClick={() => setShowUserProfile(true)}>
            <User className="h-5 w-5" />
            <span>Edit Profile</span>
          </button>
        </li>
        <li>
          <button className="flex items-center space-x-2" onClick={() => setShowAbout(true)}>
            <Info className="h-5 w-5" />
            <span>About</span>
          </button>
        </li>
      </ul>
      {showCreateRoom && <CreateChatRoom onClose={() => setShowCreateRoom(false)} />}
      {showUserProfile && <UserProfile onClose={() => setShowUserProfile(false)} />}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
}
