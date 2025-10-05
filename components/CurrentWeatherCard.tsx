import React, { useState, useEffect, useRef } from 'react';
import type { CurrentData } from '../types';
import { getAqiInfo } from '../services/airQualityService';

interface CurrentWeatherCardProps {
  data: CurrentData;
  city: string;
}

const LocationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const useAnimatedValue = (endValue: number, duration = 1000) => {
    const [animatedValue, setAnimatedValue] = useState(endValue);
    const frameRef = useRef<number | null>(null);
    const valueOnRender = useRef(endValue);

    useEffect(() => {
        const startValue = valueOnRender.current;
        let startTime: number | null = null;
        
        valueOnRender.current = endValue;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const currentValue = startValue + (endValue - startValue) * percentage;
            setAnimatedValue(currentValue);

            if (percentage < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [endValue, duration]);
    
    return animatedValue;
};


const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, city }) => {
  const { aqi, level } = data;
  const aqiInfo = getAqiInfo(aqi);

  const animatedAqi = useAnimatedValue(aqi);
  const [displayLevel, setDisplayLevel] = useState(level);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (displayLevel !== level) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayLevel(level);
        setIsFading(false);
      }, 250); // Half of the transition duration-500
      return () => clearTimeout(timer);
    }
  }, [level, displayLevel]);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div>
        <div className="flex items-center justify-center gap-2 mb-2 text-slate-800">
            <LocationIcon className="h-6 w-6"/>
            <h2 className="text-2xl font-semibold">{city}</h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p>Live Simulation</p>
        </div>
      </div>

      <div className="my-4">
        <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-inner transition-colors duration-500 ${aqiInfo.color}`}>
          {Math.round(animatedAqi)}
        </div>
        <p className={`mt-4 text-2xl font-bold ${aqiInfo.textColor} px-4 py-2 rounded-full ${aqiInfo.color} bg-opacity-30 inline-block transition-all duration-500 transform ${isFading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          {displayLevel}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-700 max-w-xs mx-auto">{aqiInfo.description}</p>
        <p className="text-sm text-slate-500 mt-2">Dominant Pollutant: <span className="font-bold">{data.dominantPollutant}</span></p>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;