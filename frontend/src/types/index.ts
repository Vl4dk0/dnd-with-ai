// types/index.ts

/**
 * Represents a player in the game.
 */
export interface Player {
  player_id: string;
  player_name: string;
}

/**
 * Represents a single chat message.
 */
export interface ChatMessage {
  message_id: string;
  player_id: string;
  player_name: string;
  text: string;
  timestamp: string; // Using string for ISO 8601 format
}

/**
 * Represents the overall state of the game session.
 */
export interface GameState {
  status: 'connecting' | 'connected' | 'disconnected';
  players: Player[];
  messages: ChatMessage[];
}

/**
 * Represents the payload for a new message sent from the client.
 */
export interface NewMessagePayload {
  text: string;
}

/**
 * Represents a generic WebSocket event message.
 */
export interface WebSocketEvent<T = unknown> {
  event_type: string;
  payload: T;
}
