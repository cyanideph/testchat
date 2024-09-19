import React, { useState, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref, push } from 'firebase/database';

interface VoiceMessageProps {
  onClose: () => void;
}

export function VoiceMessage({ onClose }: VoiceMessageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { currentRoom } = useChat();
  const { user } = useAuth();
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();

    const audioChunks: BlobPart[] = [];
    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
    });

    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async () => {
    if (audioBlob && currentRoom && user) {
      const storage = getStorage();
      const audioRef = storageRef(storage, `voice_messages/${currentRoom.id}/${Date.now()}.wav`);
      await uploadBytes(audioRef, audioBlob);
      const audioURL = await getDownloadURL(audioRef);

      const database = getDatabase();
      const messagesRef = ref(database, `messages/${currentRoom.id}`);
      await push(messagesRef, {
        type: 'voice',
        audioURL,
        userId: user.uid,
        userName: user.displayName || user.email,
        timestamp: Date.now(),
      });

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold mb-4">Record Voice Message</h3>
        <div className="flex justify-center space-x-4 mb-4">
          {!isRecording && !audioBlob && (
            <button className="btn btn-primary" onClick={startRecording}>Start Recording</button>
          )}
          {isRecording && (
            <button className="btn btn-error" onClick={stopRecording}>Stop Recording</button>
          )}
          {audioBlob && (
            <button className="btn btn-success" onClick={sendVoiceMessage}>Send Voice Message</button>
          )}
        </div>
        {audioBlob && (
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
        )}
        <div className="mt-4 flex justify-end">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}