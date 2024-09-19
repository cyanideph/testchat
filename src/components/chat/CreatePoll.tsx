import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { getDatabase, ref, push } from 'firebase/database';

interface CreatePollProps {
  onClose: () => void;
}

export function CreatePoll({ onClose }: CreatePollProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { currentRoom } = useChat();
  const { user } = useAuth();

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = async () => {
    if (question && options.filter(o => o.trim()).length >= 2 && currentRoom && user) {
      const database = getDatabase();
      const messagesRef = ref(database, `messages/${currentRoom.id}`);
      await push(messagesRef, {
        type: 'poll',
        question,
        options: options.filter(o => o.trim()),
        votes: {},
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
        <h3 className="text-lg font-bold mb-4">Create a Poll</h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Question</span>
            </label>
            <input
              type="text"
              placeholder="Enter your question"
              className="input input-bordered w-full"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          {options.map((option, index) => (
            <div key={index} className="form-control">
              <label className="label">
                <span className="label-text">Option {index + 1}</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="input input-bordered w-full"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {index >= 2 && (
                  <button className="btn btn-square btn-error" onClick={() => removeOption(index)}>
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-secondary w-full" onClick={addOption}>
            Add Option
          </button>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={createPoll}>Create Poll</button>
        </div>
      </div>
    </div>
  );
}