import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="absolute z-10">
      <Picker
        data={data}
        onEmojiSelect={(emoji: { native: string }) => onEmojiSelect(emoji.native)} // Use an inline type
        theme="light"
        set="apple"
      />
    </div>
  );
}
