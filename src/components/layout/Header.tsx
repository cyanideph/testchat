import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Avatar } from '../ui/Avatar';
import { Menu, Moon, Sun, ChevronDown } from 'lucide-react';
import { Menu as MenuDropdown } from '@headlessui/react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    signOut(auth);
  };

  const avatarSeed = user?.photoURL || 'default'; // Update to use photoURL

  return (
    <header className="bg-gray-800 text-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2 md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-violet-300 bounce">
            UZZAP-BETA
          </h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme toggle button */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-300" />}
          </Button>

          {/* User profile and dropdown */}
          {user ? (
            <MenuDropdown as="div" className="relative">
              <MenuDropdown.Button className="flex items-center space-x-2 text-sm text-gray-100">
                <Avatar seed={avatarSeed} size="small" />
                <span>{user.displayName || user.email}</span>
                <ChevronDown className="h-4 w-4" />
              </MenuDropdown.Button>
              <MenuDropdown.Items className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-100 border border-gray-700 rounded-md shadow-lg">
                <MenuDropdown.Item>
                  <Button onClick={handleSignOut} variant="secondary" size="sm" className="w-full text-gray-100">
                    Sign Out
                  </Button>
                </MenuDropdown.Item>
              </MenuDropdown.Items>
            </MenuDropdown>
          ) : null}
        </div>
      </div>
    </header>
  );
};
