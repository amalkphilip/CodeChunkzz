import React from 'react';
import type { PollutantData } from '../types';
import { POLLUTANT_INFO } from '../services/airQualityService';

interface PollutantDetailsProps {
  data: PollutantData;
}

const PollutantItem: React.FC<{ name: string; value: number; unit: string; description: string }> = ({ name, value, unit, description }) => (
  <div className="bg-black/5 rounded-lg p-4 text-center transform transition-transform duration-300 hover:scale-110 hover:bg-black/10">
    <p className="text-lg font-bold text-slate-700">{name}</p>
    <p className="text-2xl font-light mt-1 text-slate-800">{value}</p>
    <p className="text-xs text-slate-500">{unit}</p>
    <p className="text-xs text-slate-500 mt-2 hidden sm:block">{description}</p>
  </div>
);

const PollutantDetails: React.FC<PollutantDetailsProps> = ({ data }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-center sm:text-left text-slate-800">Pollutant Details</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {(Object.keys(data) as Array<keyof PollutantData>).map((key) => {
            const info = POLLUTANT_INFO[key];
            return info ? (
              <PollutantItem
                key={key}
                name={info.name}
                value={data[key]}
                unit={info.unit}
                description={info.description}
              />
            ) : null;
        })}
      </div>
    </div>
  );
};

export default PollutantDetails;