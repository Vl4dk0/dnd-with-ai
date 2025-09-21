// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const createGame = async () => {
    try {
      // This will be replaced with the actual API call
      const response = await fetch('http://localhost:8000/games', {
        method: 'POST',
      });
      const data = await response.json();
      navigate(`/game/${data.game_id}`);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const joinGame = () => {
    if (gameId.trim()) {
      navigate(`/game/${gameId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-5xl font-bold mb-8">AI Dungeon Master</h1>
      <div className="space-y-4">
        <button
          onClick={createGame}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Create New Game
        </button>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter Game ID"
            className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
