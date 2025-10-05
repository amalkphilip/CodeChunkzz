import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ForecastDay } from '../types';

interface ForecastChartProps {
  data: ForecastDay[];
}

const getAqiColor = (aqi: number) => {
  if (aqi <= 50) return '#22c55e'; // green-500
  if (aqi <= 100) return '#facc15'; // yellow-400
  if (aqi <= 150) return '#f97316'; // orange-500
  if (aqi <= 200) return '#ef4444'; // red-500
  if (aqi <= 300) return '#9333ea'; // purple-600
  return '#881337'; // maroon-800
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-white/20">
        <p className="label text-white font-bold">{`${label}`}</p>
        <p className="intro text-slate-300">{`AQI: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-center sm:text-left text-slate-800">7-Day Forecast</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5, right: 20, left: -10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b' }} />
            <YAxis tick={{ fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}/>
            <Bar dataKey="aqi">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getAqiColor(entry.aqi)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;