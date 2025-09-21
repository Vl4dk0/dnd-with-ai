// src/hooks/useGameSocket.ts
import { useEffect, useReducer, useRef } from 'react';
import type { GameState, WebSocketEvent, ChatMessage, Player } from '../types';

type GameAction =
  | { type: 'SET_STATUS'; payload: 'connecting' | 'connected' | 'disconnected' }
  | {
      type: 'SET_GAME_STATE';
      payload: { players: Player[]; messages: ChatMessage[] };
    }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: Player }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, ...action.payload };
    case 'ADD_PLAYER':
      // Avoid adding duplicate players
      if (state.players.find((p) => p.player_id === action.payload.player_id)) {
        return state;
      }
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(
          (p) => p.player_id !== action.payload.player_id
        ),
      };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

const useGameSocket = (
  gameId: string,
  playerId: string,
  playerName: string
) => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    status: 'connecting',
    players: [],
    messages: [],
  });

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8000/ws/games/${gameId}?player_id=${playerId}&player_name=${playerName}`
    );
    const wsCurrent = ws.current;

    wsCurrent.onopen = () =>
      dispatch({ type: 'SET_STATUS', payload: 'connected' });
    wsCurrent.onclose = () =>
      dispatch({ type: 'SET_STATUS', payload: 'disconnected' });

    wsCurrent.onmessage = (event) => {
      const message: WebSocketEvent = JSON.parse(event.data);

      switch (message.event_type) {
        case 'game_state_update':
          dispatch({ type: 'SET_GAME_STATE', payload: message.payload });
          break;
        case 'user_joins':
          dispatch({ type: 'ADD_PLAYER', payload: message.payload });
          break;
        case 'user_leaves':
          dispatch({ type: 'REMOVE_PLAYER', payload: message.payload });
          break;
        case 'new_message':
          dispatch({ type: 'ADD_MESSAGE', payload: message.payload });
          break;
      }
    };

    return () => {
      wsCurrent.close();
    };
  }, [gameId, playerId, playerName]);

  const sendMessage = (text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketEvent = {
        event_type: 'new_message',
        payload: { text, player_id: playerId, player_name: playerName },
      };
      ws.current.send(JSON.stringify(message));
    }
  };

  return { gameState, sendMessage };
};

export default useGameSocket;
