import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { Button } from '../ui/Button';
import { CreateChatRoom } from '../modals/CreateChatRoom';
import { UserProfile } from '../modals/UserProfile';
import { About } from '../modals/About';
import { Plus, User, Info, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { rooms, currentRoom, setCurrentRoom } = useChat();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-darkMagneta dark:bg-lightViolet text-white dark:text-black transition-transform duration-300 ease-in-out shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="font-bold text-lg">CHATROOMS</h2>
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <Button
                  variant={currentRoom?.id === room.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentRoom(room);
                    closeSidebar();
                  }}
                >
                  # {room.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="ghost"
            className="w-full mb-2"
            onClick={() => setShowCreateRoom(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            CREATE ROOM
          </Button>
          <Button
            variant="ghost"
            className="w-full mb-2"
            onClick={() => setShowUserProfile(true)}
          >
            <User className="h-5 w-5 mr-2" />
            EDIT PROFILE
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowAbout(true)}
          >
            <Info className="h-5 w-5 mr-2" />
            ABOUT
          </Button>
        </div>
      </aside>

      {/* Modals */}
      {showCreateRoom && <CreateChatRoom onClose={() => setShowCreateRoom(false)} />}
      {showUserProfile && <UserProfile onClose={() => setShowUserProfile(false)} />}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </>
  );
};
