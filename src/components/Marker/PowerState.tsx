import * as React from 'react';
import { PowerStateProps } from './types';
import './powerstate.css';
import { motion } from 'framer-motion';

const LINE_HIGHT = 15;
const FONT_SIZE = 14;

export const PowerState: React.FC<PowerStateProps> = ({ max_power, min_power, state }) => {
  const istPercents = 100 - (100 * state.ist) / max_power;
  const displayIst = LINE_HIGHT * 1.5 < istPercents && istPercents < 100 - LINE_HIGHT * 1.5;

  const plusPercents = 100 + LINE_HIGHT - (100 * (state.ist + state.potential_plus)) / max_power;
  const minusPercents = 100 - LINE_HIGHT - (100 * (state.ist - state.potential_minus)) / max_power;

  // const displayPlus = istPercents - plusPercents > FONT_SIZE;
  const displayPlusText = LINE_HIGHT * 1.5 < istPercents;
  // const displayMinus = minusPercents - istPercents > FONT_SIZE;
  const displayMinusText = istPercents < 100 - LINE_HIGHT * 1.5;

  return (
    <div className="d-flex flex-row" style={{ width: '150px', height: '100px' }}>
      <svg width="100%" height="100%" viewBox="0 0 150 100">
        <svg width="100%" height={LINE_HIGHT + 'px'} viewBox="0 0 150 10" y="0">
          <line x1="0" y1="0" x2="70" y2="0" stroke="black" strokeWidth="1.5px" strokeDasharray="5,5" />
          <text x="75" y="10" fontSize={FONT_SIZE + 'px'}>
            {max_power.toFixed(1)} MW
          </text>
        </svg>

        <svg width="100%" height={LINE_HIGHT + 'px'} viewBox="0 0 150 10" y="88">
          <line x1="0" y1="9" x2="70" y2="9" stroke="black" strokeWidth="1.5px" strokeDasharray="5,5" />
          <text x="75" y="10" fontSize={FONT_SIZE + 'px'}>
            {min_power.toFixed(1)} MW
          </text>
        </svg>

        <motion.svg
          width="100%"
          height={LINE_HIGHT + 'px'}
          viewBox="0 0 150 10"
          animate={{ y: istPercents - LINE_HIGHT / 2 }}
          initial={{ y: 0 }}
        >
          <line x1="0" y1="5" x2="70" y2="5" stroke="black" strokeWidth="3px" />
          {displayIst && (
            <text x="75" y="10" fontSize={FONT_SIZE + 'px'}>
              {state.ist.toFixed(1)} MW
            </text>
          )}
        </motion.svg>

        <defs>
          <marker id="arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
            <path d="M2,1 L2,7.5 L5,6 L2,4.5" style={{ fill: 'rgb(126,182,208' }} />
          </marker>
        </defs>

        {displayPlusText && (
          <motion.line
            x1="70"
            x2="70"
            animate={{ y1: istPercents - 3, y2: Math.min(plusPercents, istPercents - FONT_SIZE) }}
            initial={{ y1: 0, y2: 0 }}
            stroke="rgb(126,182,208"
            strokeWidth="3px"
            markerEnd="url(#arrow)"
          />
        )}

        {displayPlusText && (
          <motion.text
            x="65"
            fontSize={FONT_SIZE + 'px'}
            textAnchor="end"
            animate={{ y: istPercents - 3 }}
            initial={{ y: 0 }}
          >
            +{state.potential_plus.toFixed(1)} MW
          </motion.text>
        )}

        {displayMinusText && (
          <motion.line
            x1="70"
            x2="70"
            animate={{ y1: istPercents + 3, y2: Math.max(minusPercents, istPercents + FONT_SIZE) }}
            initial={{ y1: 0, y2: 0 }}
            stroke="rgb(126,182,208"
            strokeWidth="3px"
            markerEnd="url(#arrow)"
          />
        )}

        {displayMinusText && (
          <motion.text
            x="65"
            fontSize={FONT_SIZE + 'px'}
            textAnchor="end"
            dominantBaseline="hanging"
            animate={{ y: istPercents + 3 }}
          >
            -{state.potential_minus.toFixed(1)} MW
          </motion.text>
        )}
      </svg>
    </div>
  );
};
