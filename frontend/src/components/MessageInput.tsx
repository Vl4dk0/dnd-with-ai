// src/components/MessageInput.tsx
import React, { useState } from 'react';

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
      />
    </form>
  );
};

export default MessageInput;
