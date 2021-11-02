import React, { useContext } from 'react';
import { Map } from '../Map/Map';
import { UIContext } from '../../context/UIStateProvider';
import { DetailView } from '../DetailView/DetailView';
import { Timeline } from '../Timeline/Timeline';
import './App.css';

const App: React.FC = () => {
  const { state } = useContext(UIContext);

  return (
    <div className="App">
      <div className="vw-100 vh-100">
        <Map />
      </div>
      <div className="position-absolute" style={{ right: '50px', top: '80px' }}>
        <DetailView />
      </div>
      <div className="position-absolute vw-80 vh-15" style={{ left: '10vw', bottom: 0, height: 200 }}>
        <Timeline />
      </div>
    </div>
  );
};

export default App;
