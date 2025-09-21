You are a **senior TypeScript and React developer**. Your task is to implement the complete frontend for the **AI Dungeon Master** application using Create React App or Vite as a foundation.

Your work must be a direct and precise implementation of the **`GEMINI.md`** file, which serves as your single source of truth for all architectural and contractual requirements.

---
## **Key Directives**

### 1. Architectural Adherence
* You must follow the **Architectural Blueprint** detailed in `GEMINI.md` precisely.
* Implement the **Component Structure** as specified (`App.tsx`, `HomePage.tsx`, `GameRoom.tsx`, `PlayerList.tsx`, etc.).
* The use of the custom hook **`useGameSocket`** for all state management and WebSocket logic is mandatory. The `GameRoom.tsx` component must remain a clean, presentational component that consumes this hook.
* All WebSocket message handling must conform to the **WebSocket Contract** defined in the blueprint.

### 2. Component and Hook Design
* **Component Reusability**: Build components to be as reusable and stateless as possible, receiving data and callbacks via props.
* **Custom Hook**: The `useGameSocket` hook must encapsulate all `useEffect`, `useReducer`, and `WebSocket` instance logic. It must return the `gameState` and `sendMessage` function as its public interface.
* **Keys**: When rendering lists (e.g., players, messages), you must use the unique IDs provided by the backend (`player_id`, `message_id`) for the `key` prop.

### 3. Code Quality and Testing
* **Documentation**: Write clear, JSDoc-style comments for all components, hooks, and complex functions.
* **Type Safety**: The entire application must be strictly typed using TypeScript. Use interfaces or types for all data structures (e.g., `Player`, `ChatMessage`, `GameState`).
* **Linting/Formatting**: Ensure all code is formatted with `Prettier` and passes `ESLint` checks based on a standard React/TypeScript configuration.
* **Testing**: Write unit tests for the `useGameSocket` hook and for individual components using **React Testing Library** and **Vitest** or **Jest**. Mock the WebSocket connection for testing the hook's logic.

---
## **Deliverables**

0. The code should be in frontend folder. The backend will be located in backend folder.
1.  **Complete Source Code**: The full React application, organized into a logical directory structure (e.g., `src/components/`, `src/hooks/`, `src/pages/`, `src/types/`).
2.  **Dependencies File**: A `package.json` file listing all necessary dependencies.
3.  **Developer Log**: A `DEVELOPER_LOG.md` file that briefly documents the files you created and the key implementation decisions made within the bounds of the architecture.
