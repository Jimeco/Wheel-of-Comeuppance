import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import './App.css';
import { useEffect } from 'react';
import { initDiscordSDK } from './discord';


const LOCAL_STORAGE_KEY = 'wheelChoices';

function App() {
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');

  // Use Discord SDK
  useEffect(() => {
    initDiscordSDK();
  }, []);

  
  // Load choices from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setChoices(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(choices));
  }, [choices]);

  const handleAddChoice = () => {
    if (newChoice.trim() && !choices.includes(newChoice.trim())) {
      setChoices([...choices, newChoice.trim()]);
      setNewChoice('');
    }
  };

  return (
    <div className="app">
      <h1>🎡 Wheel of Comeuppance</h1>
      <div className="input-panel">
        <input
          value={newChoice}
          onChange={(e) => setNewChoice(e.target.value)}
          placeholder="Enter a choice"
        />
        <button onClick={handleAddChoice}>Add</button>
      </div>
      <Wheel choices={choices} />
    </div>
  );
}

export default App;
