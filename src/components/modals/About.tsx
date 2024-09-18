import React from 'react';
import { Button } from '../ui/Button';

interface AboutProps {
  onClose: () => void;
}

export const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary">ABOUT UZZAP-BETA</h2>
        <div className="space-y-4 text-foreground">
          <p>
            UZZAP-BETA is a cutting-edge web chat application designed to provide seamless communication in real-time. 
            With features like multiple chatrooms, file sharing, and user profiles, UZZAP-BETA aims to enhance your 
            online communication experience.
          </p>
          <p>
            Whether you're collaborating with teammates, chatting with friends, or meeting new people, 
            UZZAP-BETA offers a user-friendly interface and robust functionality to meet all your chat needs.
          </p>
          <p className="font-semibold text-primary">
            Created by CY
          </p>
          <p className="text-sm text-muted-foreground">
            Version: BETA 1.0
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};
