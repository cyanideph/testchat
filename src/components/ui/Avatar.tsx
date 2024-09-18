import React from 'react';

interface AvatarProps {
  seed: string;
  style?: string;
  size?: 'small' | 'large';
}

export const Avatar: React.FC<AvatarProps> = ({ seed, style = 'avataaars', size = 'small' }) => {
  const sizeClasses = size === 'large' ? 'w-16 h-16' : 'w-8 h-8'; // Adjust size based on prop

  return (
    <div className={`avatar ${sizeClasses}`}>
      <img
        src={`https://avatars.dicebear.com/api/${style}/${seed}.svg`}
        alt="User Avatar"
        className="rounded-full"
      />
    </div>
  );
};
