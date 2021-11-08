import React, { createContext, useEffect, useRef, useState } from 'react';
import { Tick } from './types';

type Timeline = Array<{ start: Date; finish: Date; name: string; value: number }>;

interface Data {
  timeline: Timeline;
  tickData: Array<Tick>;
  currentTick: number;
}
const initialState: Data = { timeline: [], tickData: [], currentTick: 0 };

const tickInterval = 300;

// const timelineMock: Timeline = [
//   { finish: 1622670300000, name: 'CSR1WIND001', start: 1622629800000, value: -1.5 },
//   { finish: 1622843100000, name: 'CSR1WIND001', start: 1622802600000, value: -1.5 },
//   { finish: 1622956500000, name: 'CSR1BIO006', start: 1622930400000, value: 0.5 },
//   { finish: 1623015900000, name: 'CSR1WIND002', start: 1622975400000, value: -1.5 },
// ].map((d) => ({ ...d, start: new Date(d.start), finish: new Date(d.finish) }));

const tickStateMock: Tick = {
  NetStates: [{ ist: 6.0, name: 'Netzbetreiber Mitte', pot_minus: 6.0, pot_plus: 1.0 }],
  PowerPlants: [
    { command: 0.0, ist: 3.0, name: 'CSR1WIND001', pot_minus: 3.0, pot_plus: 0.0 },
    { command: 0.0, ist: 3.0, name: 'CSR1WIND002', pot_minus: 3.0, pot_plus: 0.0 },
    { command: 0.0, ist: 0.0, name: 'CSRSONN003', pot_minus: 0.0, pot_plus: 0.0 },
    { command: 0.0, ist: 0.0, name: 'CSR1SONN004', pot_minus: 0.0, pot_plus: 0.0 },
    { command: 0.0, ist: 0.0, name: 'CSR1BIO005', pot_minus: 0.0, pot_plus: 0.5 },
    { command: 0.0, ist: 0.0, name: 'CSR1BIO006', pot_minus: 0.0, pot_plus: 0.5 },
  ],
  time: 1622598300000,
};

export const DataContext = createContext<{ data: Data }>({ data: initialState });

export const DataProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<Data>({ timeline: [], tickData: [tickStateMock], currentTick: 0 });

  const interval = useRef<NodeJS.Timer>(null);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://localhost:8890/get_timeline');
      return await response.json();
    } catch (e) {
      interval.current && clearInterval(interval.current);
    }
  };

  const fetchTick = async () => {
    try {
      const response = await fetch('http://localhost:8890/get_tick');
      const result = await response.json();
      if (result.message && result.message === 'No more data') {
        interval.current && clearInterval(interval.current);
      } else {
        return result;
      }
    } catch (e) {
      interval.current && clearInterval(interval.current);
    }
  };

  const fetchData = async () => {
    try {
      const tick = await fetchTick();
      const timeline = await fetchTimeline();
      tick && timeline && setState((state) => ({ ...state, timeline, tickData: [...state.tickData, tick] }));
    } catch (e) {
      interval.current && clearInterval(interval.current);
    }
  };

  useEffect(() => {
    fetchData();
    // @ts-ignore
    interval.current = setInterval(async () => {
      fetchData();
      setState((state) => ({ ...state, currentTick: state.currentTick + 1 }));
    }, tickInterval);
    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, []);

  return <DataContext.Provider value={{ data: state }}>{children}</DataContext.Provider>;
};
