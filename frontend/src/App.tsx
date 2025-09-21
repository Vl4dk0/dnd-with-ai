// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <Router>
      <div className="App bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameId" element={<GameRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;