import * as React from 'react';
import './style.css'
import { SpinnerProps } from './types';
import { motion } from 'framer-motion';

export const FillCircle: React.FC<SpinnerProps> = ({className, style, radius, color, strokeWidth}) => {
    const spinnerStyle = {
        border: strokeWidth + " solid rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
        width: radius,
        height: radius,
    }

    const radiusAsNumber = parseInt(radius.replace("px", ""))
    const fillStyle = { clip: `rect(0px, ${radiusAsNumber / 2}px, ${radius}, 0px`}
    const holdStyle = { clip: `rect(0px, ${radius}, ${radius}, ${radiusAsNumber / 2}px`}

    return (
        <div className={className} id='loading' style={{...style, width: radius, height: radius}}>
            <div className="position-absolute" style={spinnerStyle} />

            <div className='hold left' style={holdStyle}>
                <div className='fill' style={{...fillStyle, borderColor: color, borderWidth: strokeWidth}}/>
            </div>
            <div className='hold right' style={holdStyle}>
                <div className='fill' style={{...fillStyle, borderColor: color, borderWidth: strokeWidth}}/>
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