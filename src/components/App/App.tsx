import React, { useEffect } from 'react';
import { Map } from '../Map/Map';
import { DetailView } from '../DetailView/DetailView';
import { Timeline } from '../Timeline/Timeline';
import { Toolbar } from '../Toolbar/Toolbar';
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    fetch('http://localhost:8890/reset_tick');
  });

  return (
    <div className="App">
      <div style={{ zIndex: 99, top: 10 }} className="position-absolute left-0">
        <Toolbar />
      </div>

      <div className="vw-100 vh-100">
        <Map />
      </div>
      <div className="position-absolute" style={{ right: '50px', top: '80px' }}>
        <DetailView />
      </div>
      <div className="position-absolute vw-80 vh-45" style={{ left: '10vw', bottom: 0 }}>
        <Timeline />
      </div>
    </div>
  );
};

export default App;
