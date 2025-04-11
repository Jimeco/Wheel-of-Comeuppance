import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import './App.css';
import { initDiscordSDK } from './discord';
import { db, ref, onValue, set } from './firebase';

const LOCAL_STORAGE_KEY = 'wheelChoices';

function App() {
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');

  // Use Discord SDK
  useEffect(() => {
    initDiscordSDK();
  }, []);

  
  useEffect(() => {
    const choicesRef = ref(db, 'choices');
    onValue(choicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setChoices(data);
    });
  }, []);
  

  const handleAddChoice = () => {
    const trimmed = newChoice.trim();
    if (trimmed && !choices.includes(trimmed)) {
      const updated = [...choices, trimmed];
      set(ref(db, 'choices'), updated); // write to Firebase
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
