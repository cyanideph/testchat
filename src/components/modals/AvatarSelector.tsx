import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface AvatarSelectorProps {
  onSelect: (style: string) => void; // Only handle style
  onClose: () => void;
}

// List of available avatar styles
const avatarStyles = [
  'initials', 'avataaars', 'bottts', 'pixel-art', 'identicon', 
  'adventurer', 'human', 'jdenticon', 'gridy', 'miniavs'
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ onSelect, onClose }) => {
  const [style, setStyle] = useState('avataaars');

  const handleStyleChange = (newStyle: string) => {
    setStyle(newStyle);
    onSelect(newStyle); // Notify parent component with style only
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h2 className="text-2xl font-bold mb-4 text-violet-800 dark:text-violet-400">Select Avatar</h2>
        <div className="flex justify-center mb-4">
          <Avatar seed="" style={style} size="large" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar Style
          </label>
          <div className="flex flex-wrap gap-2">
            {avatarStyles.map((avatarStyle) => (
              <button
                key={avatarStyle}
                className={`p-2 rounded-md ${
                  style === avatarStyle
                    ? 'bg-violet-100 dark:bg-violet-800 ring-2 ring-violet-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
                onClick={() => handleStyleChange(avatarStyle)}
              >
                <Avatar seed="" style={avatarStyle} size="small" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
