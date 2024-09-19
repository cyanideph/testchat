import React from 'react';

interface AboutProps {
  onClose: () => void;
}

export function About({ onClose }: AboutProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold mb-4">About UZZAP-BETA</h3>
        <p className="mb-4">
          UZZAP-BETA is a cutting-edge web chat application designed to provide seamless communication in real-time. 
          With features like multiple chatrooms, file sharing, and user profiles, UZZAP-BETA aims to enhance your 
          online communication experience.
        </p>
        <p className="mb-4">
          Whether you're collaborating with teammates, chatting with friends, or meeting new people, 
          UZZAP-BETA offers a user-friendly interface and robust functionality to meet all your chat needs.
        </p>
        <p className="font-semibold text-primary mb-2">
          Created by CY
        </p>
        <p className="text-sm text-base-content/70 mb-4">
          Version: BETA 1.0
        </p>
        <div className="flex justify-end">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}