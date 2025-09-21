// src/components/PlayerList.tsx
import React from 'react';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.player_id} className="mb-2">
            {player.player_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
