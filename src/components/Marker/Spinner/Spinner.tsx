import * as React from 'react';
import './style.css'
import { SpinnerProps } from './types';
import { motion } from 'framer-motion';

export const FillCircle: React.FC<SpinnerProps> = ({className, radius, color, strokeWidth}) => {
    const spinnerStyle = {
        border: strokeWidth + " solid rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
        width: radius,
        height: radius,
    }

    return (
        <div className={className} id='loading' style={{width: radius, height: radius}}>
            <div className="position-absolute" style={spinnerStyle} />

            <div className='hold left'>
                <div className='fill' style={{borderColor: color, borderWidth: strokeWidth}}/>
            </div>
            <div className='hold right'>
                <div className='fill' style={{borderColor: color, borderWidth: strokeWidth}}/>
            </div>
        
        </div>
    )
}


export const LoadingCircle: React.FC<SpinnerProps> = ({radius, color, strokeWidth}) => {
    const spinnerStyle = {
        border: strokeWidth + " solid rgba(0, 0, 0, 0.1)",
        borderTop: strokeWidth + " solid " + color,
        borderRadius: "50%",
        width: radius,
        height: radius,
    }

    return (
        <motion.div 
            style={spinnerStyle} 
            animate={{
            rotate: Array.from(Array(360).keys())
            }}
            transition={{
            loop: Infinity,
            duration: 1,
            ease: "easeInOut",
            }}
      />
    )
    
}