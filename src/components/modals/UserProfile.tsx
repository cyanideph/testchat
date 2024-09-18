import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { AvatarSelector } from '../modals/AvatarSelector';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.photoURL || 'default');
  const [avatarStyle, setAvatarStyle] = useState('avataaars');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        displayName,
        photoURL: avatarSeed // Assuming photoURL is used for avatar
      });
      onClose();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleAvatarSelect = (style: string) => {
    setAvatarStyle(style);
    setShowAvatarSelector(false); // Close the selector when an avatar is chosen
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary">EDIT PROFILE</h2>
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => setShowAvatarSelector(true)}
            className="focus:outline-none"
          >
            <Avatar seed={avatarSeed} style={avatarStyle} size="large" />
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="w-full"
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
      {showAvatarSelector && (
        <AvatarSelector
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
};
