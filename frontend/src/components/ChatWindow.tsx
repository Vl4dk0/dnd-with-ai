// src/components/ChatWindow.tsx
import React from 'react';
import type { ChatMessage } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <div key={msg.message_id} className="mb-4">
          <span className="font-bold">{msg.player_name}: </span>
          <span>{msg.text}</span>
          <span className="text-xs text-gray-400 ml-2">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
