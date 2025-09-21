// src/pages/GameRoom.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import useGameSocket from '../hooks/useGameSocket';

const GameRoom: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  // A mock player_id and player_name. In a real app, this would come from auth.
  const playerId = `player_${Date.now()}`;
  const playerName = `Player ${Math.floor(Math.random() * 1000)}`;

  const { gameState, sendMessage } = useGameSocket(gameId!, playerId, playerName);

  if (gameState.status !== 'connected') {
    return <div className="flex items-center justify-center min-h-screen">{gameState.status}...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 p-4">
        <PlayerList players={gameState.players} />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={gameState.messages} />
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default GameRoom;
