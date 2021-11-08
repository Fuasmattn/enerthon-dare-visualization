import * as React from 'react';
import { PowerStateProps } from './types';
import './powerstate.css';
import { motion } from 'framer-motion';

const LINE_HIGHT = 15;
const FONT_SIZE = 14;

const DURATION = 2;
const INITIAL_DURATION = 0.5;

export const PowerState: React.FC<PowerStateProps> = ({ max_power, min_power, state }) => {
  const istPercents = 100 - (100 * state.ist) / max_power;
  const displayIst = LINE_HIGHT * 1.5 < istPercents && istPercents < 100 - LINE_HIGHT * 1.5;

  const plusPercents = 100 + LINE_HIGHT - (100 * (state.ist + state.potential_plus)) / max_power;
  const minusPercents = 100 - LINE_HIGHT - (100 * (state.ist - state.potential_minus)) / max_power;

  const displayPlusText = LINE_HIGHT < istPercents && state.potential_plus >= 0.05;
  const displayMinusText = istPercents < 100 - LINE_HIGHT * 1.5 && state.potential_minus >= 0.1;

  return (
    <div className="d-flex flex-row" style={{ width: '150px', height: '100px' }}>
      <svg width="100%" height="100%" viewBox="0 0 150 100">
        <svg width="100%" height={LINE_HIGHT + 'px'} viewBox="0 0 150 10" y="0">
          <line x1="0" y1="0" x2="70" y2="0" stroke="black" strokeWidth="1.5px" strokeDasharray="2,5" />
          <text x="75" y="10" fontSize={FONT_SIZE + 'px'}>
            {max_power.toFixed(1)} MW
          </text>
        </svg>

        <svg width="100%" height={LINE_HIGHT + 'px'} viewBox="0 0 150 10" y="87">
          <line x1="0" y1="9" x2="70" y2="9" stroke="black" strokeWidth="1.5px" strokeDasharray="2,5" />
          <text x="75" y="10" fontSize={FONT_SIZE + 'px'}>
            {min_power.toFixed(1)} MW
          </text>
        </svg>

        <motion.line
          animate={{ y: Math.max(Math.min(istPercents, 98.5), 2) }}
          initial={{ y: 100 }}
          transition={{ duration: istPercents > 0 ? DURATION : INITIAL_DURATION }}
          x1="0"
          y1="0"
          x2="70"
          y2="0"
          stroke="black"
          strokeWidth="1.5px"
        />

        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <motion.stop offset="20%" stopColor="green" animate={{ stopOpacity: (100 - istPercents) / 100 }} />
          <stop offset="100%" stopColor="green" stopOpacity="0.2" />
        </linearGradient>

        <motion.rect
          width="50"
          animate={{ height: 100 - istPercents, y: istPercents }}
          initial={{ height: 0, y: 100 }}
          transition={{ duration: istPercents > 0 ? DURATION : INITIAL_DURATION }}
          x="0"
          style={{ fill: 'url(#gradient)', opacity: 0.5 }}
        />

        <defs>
          <marker id="arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
            <path d="M2,1 L2,7.5 L5,6 L2,4.5" style={{ fill: 'rgb(126,182,208' }} />
          </marker>
        </defs>

        {displayPlusText && (
          <motion.line
            x1="60"
            x2="60"
            animate={{ y1: istPercents - 3, y2: plusPercents }}
            initial={{ y1: 0 + LINE_HIGHT, y2: 0 + LINE_HIGHT }}
            transition={{ duration: istPercents > 0 ? DURATION : INITIAL_DURATION }}
            stroke="rgb(126,182,208)"
            strokeWidth="3px"
            markerEnd="url(#arrow)"
          />
        )}

        {displayMinusText && (
          <motion.line
            x1="60"
            x2="60"
            animate={{ y1: istPercents + 3, y2: minusPercents }}
            initial={{ y1: 100 - LINE_HIGHT, y2: 100 - LINE_HIGHT }}
            transition={{ duration: istPercents > 0 ? DURATION : INITIAL_DURATION }}
            stroke="rgb(126,182,208"
            strokeWidth="3px"
            markerEnd="url(#arrow)"
          />
        )}
      </svg>
    </div>
  );
};
