# AI Dungeon Master: Contributor Guide & Architectural Mandate

## 1. Core Mandate for All Contributors

**Your primary directive is to build and extend the AI Dungeon Master application. All work must be executed in strict accordance with the official architectural blueprint detailed in Section 2 of this document.**

This is not a suggestion; it is the core requirement for any contribution. Your goal is to produce production-ready, scalable, and maintainable code.

### Principles of Development:

* **Architectural Adherence**: The blueprint in Section 2 is the single source of truth. Do not deviate from the specified patterns, data contracts, or component responsibilities.
* **Scalable & Modular Design**: All code must be designed for future expansion. Avoid monolithic structures (e.g., a single `main.py` file for the entire backend).
    * **Backend**: Implement a modular structure using separate files for routing, services, data models, and business logic.
    * **Frontend**: Build a library of reusable, well-defined components and hooks.
* **Code Quality & Documentation**: Your work must be clear, documented, and easy for others to understand.
    * **Docstrings & Comments**: All functions, classes, and complex logic blocks must be documented with clear, concise docstrings (e.g., Google-style for Python).
    * **Coding Guidelines**: Adhere to standard industry style guides. Use formatters and linters (e.g., `black` and `ruff` for Python; `Prettier` and `ESLint` for TypeScript/React).
    * **Commit Hygiene**: Write clear, descriptive Git commit messages that explain the "what" and "why" of your changes. Use Github's mcp to commit changes.
    * **Testing**: Write comprehensive unit and integration tests. Aim for high code coverage and ensure all tests pass before merging.
* **Process Documentation**: Maintain a simple `DEVELOPER_LOG.md` file in the root of your feature branch. In it, briefly log your key decisions, the files you created or modified, and any challenges you encountered. This creates a transparent record of your work.

---

## 2. The Architectural Blueprint (Single Source of Truth)

**The following document is the definitive and authoritative plan for the project. All development is subordinate to this blueprint.**

This document outlines the complete software architecture for the Minimum Viable Product (MVP) of the Dungeons & Dragons real-time chat application.

-----

### **1. Summary**

  * **Goal**: To create a real-time, multi-user chat room environment for D\&D game sessions.
  * **Technology Stack**:
      * **Backend**: Python with FastAPI
      * **Frontend**: TypeScript with React
      * **Communication**: WebSockets for real-time events and a REST API for session management.
  * **Architecture Pattern**: The system is a **client-server application**. Real-time communication follows an **Event-Driven Architecture**, specifically a **Broker Topology**. The FastAPI backend acts as a central message broker, receiving events from one client and distributing them to all other clients within the same game session

-----

### **2. Architectural Decision Record (ADR)**

An ADR documents a significant architectural choice, its context, and consequences.

  * **Title**: MVP Session State Management
  * **Status**: Accepted 
  * **Context**: The MVP requires a mechanism to store the state of active game sessions (players, chat history) with high performance for real-time updates. The primary drivers are development speed and simplicity.
  * **Decision**: All game session state will be stored **in-memory** within the single FastAPI server process. This avoids the overhead of external dependencies like a database or cache for the MVP.
  * **Consequences**:
      * **Positive**:
          * Extremely fast read/write access to state, ideal for real-time applications.
          * Simplified development and reduced operational complexity.
      * **Negative**:
          * **State is volatile** and will be lost on server restart.
          * The solution is **not scalable** across multiple server instances, as state is not shared.
      * **Evolution Path**: For a production system, this in-memory store will be replaced by a dedicated, scalable solution like Redis.

-----

### **3. System Components & Interaction Flow**

The system consists of two primary components: a Frontend single-page application and a Backend service. They interact via both REST and WebSockets.

#### **System Diagram**

```text
+----------------+      (1) REST API (Create/Join Game)       +-------------------+
|                | -----------------------------------------> |                   |
|    Frontend    |                                            |     Backend       |
| (React App)    |      (2) WebSocket (Real-time Chat)        | (FastAPI Service) |
|                | <========================================> |                   |
+----------------+                                            +-------------------+
```

#### **User Journey**

1.  **User A** lands on the **Homepage**.
2.  User A clicks "Create Game." The **Frontend** makes a `POST /games` request to the **Backend**.
3.  The **Backend** creates a session, stores it in memory, and returns a unique `game_id`.
4.  The **Frontend** redirects User A to the **Game Room** page for that `game_id`.
5.  The **Game Room** component mounts and establishes a persistent **WebSocket** connection to the backend.
6.  **User B** receives the `game_id` from User A and navigates to the Game Room URL.
7.  User B's client also establishes a **WebSocket** connection.
8.  The **Backend** notifies all clients in the session that User B has joined. User A's player list updates in real-time.
9.  User A sends a chat message. The message is sent over their **WebSocket** connection.
10. The **Backend** receives the message and broadcasts it to all connected clients in the session, including User A and User B.
11. Both users' chat windows update instantly.

-----

### **4. Backend Architecture (FastAPI)**

The backend manages game state and facilitates real-time communication.

#### **REST API Contract**

  * `POST /games`
      * **Description**: Creates a new game session.
      * **Response**: `200 OK`
        ```json
        { "game_id": "A4B9F1" }
        ```
  * `GET /games/{game_id}`
      * **Description**: Checks if a game session exists.
      * **Response**: `200 OK` or `404 Not Found`.
        ```json
        { "exists": true }
        ```

#### **WebSocket Contract**

  * **Endpoint**: `ws://<host>/ws/games/{game_id}?player_id={player_id}&player_name={player_name}`
  * **Connection Logic**:
      * The server will **reject** a connection if the `game_id` does not exist or if the `player_id` is already connected to that session.
  * **Message Format**: All messages are JSON objects with `event_type` and `payload`.

| Event Type          | Direction             | Payload Description                                                                                                                              |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `game_state_update` | Server → New Client   | Provides the full list of current players and recent messages upon a successful connection.                                                        |
| `user_joins`        | Server → All Clients  | Broadcast when a new player connects. The payload contains the new player's object.                                                                |
| `user_leaves`       | Server → All Clients  | Broadcast when a player disconnects. The payload contains the leaving player's object.                                                             |
| `new_message`       | Client ↔ Server       | Sent from a client to the server, then broadcast by the server to all clients. The server will add a unique `message_id` and a `timestamp` before broadcasting. |

#### **State Management**

A `GameManager` class will be implemented to hold the state of all active games. An instance of this class will be managed as a **singleton** and provided to route handlers using FastAPI's **dependency injection** system. This ensures a clean, testable design and avoids global variables.

#### **Data Models (Pydantic)**

  * **Player**:
      * `player_id: str`
      * `player_name: str`
  * **ChatMessage**:
      * `message_id: str` (Server-generated UUID)
      * `player_id: str`
      * `player_name: str`
      * `text: str`
      * `timestamp: datetime` (Server-generated)

-----

### **5. Frontend Architecture (React)**

The frontend is responsible for all rendering and user interaction.

#### **Component Structure**

  * `App.tsx`: Root component, manages routing (`/`, `/game/:gameId`).
  * `HomePage.tsx`: Landing page with UI for creating or joining a game.
  * `GameRoom.tsx`: The primary view for an active game. It uses the `useGameSocket` hook for its logic and renders the UI components below.
  * `PlayerList.tsx`: Displays the list of connected players.
  * `ChatWindow.tsx`: Renders the list of chat messages. Uses the unique `message_id` for list keys.
  * `MessageInput.tsx`: Provides the input field and send functionality.

#### **State Management & Logic: The `useGameSocket` Hook**

To promote reusability and separation of concerns, all WebSocket lifecycle management and state handling will be encapsulated within a single custom React hook: `useGameSocket`.

  * **Responsibilities**:
    1.  Establish and close the WebSocket connection within a `useEffect` hook.
    2.  Manage all game state (`players`, `messages`, `connection_status`) using a `useReducer` hook.
    3.  Parse incoming WebSocket messages and dispatch actions to the reducer to update the state.
  * **Interface**: The hook will be called from `GameRoom.tsx` and will return the necessary state and functions:
      * `gameState`: An object containing the current `status`, `players`, and `messages`.
      * `sendMessage`: A function to send a new chat message to the server.

-----

### **6. Operations & Deployment Principles**

The application should adhere to the **Twelve-Factor App** methodology to ensure a scalable and maintainable setup.

  * **Configuration**: All environment-specific values (e.g., allowed CORS origins) must be stored in environment variables, not hardcoded.
  * **Dependencies**: Backend (`requirements.txt`) and frontend (`package.json`) dependencies must be explicitly declared and isolated.
  * **Logs**: The application should write all log output to `stdout`, treating logs as an event stream. An external service will be responsible for log collection and aggregation in a production environment.
