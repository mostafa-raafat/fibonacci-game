import React from 'react';
import './App.css';
import GameComponent from './components/game/game.component';

function App() {
  return (
    <div className="App">
      <GameComponent rows={50} cols={50}></GameComponent>
    </div>
  );
}

export default App;
