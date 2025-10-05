import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AirQualityData, PollutantData } from './types';
import { getAirQualityData, getAqiInfo, POLLUTANT_INFO } from './services/airQualityService';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import PollutantDetails from './components/PollutantDetails';
import ForecastChart from './components/ForecastChart';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('kanjirapally');
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchData = useCallback(async (searchCity: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsLoading(true);
    setError(null);
    setAirQualityData(null);

    try {
      const data = await getAirQualityData(searchCity);
      setAirQualityData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(city);
    
  }, []);

 
  useEffect(() => {
    if (isLoading || error || !airQualityData) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setAirQualityData(currentData => {
        if (!currentData) return null;

        const newPollutants = { ...currentData.pollutants };
        (Object.keys(newPollutants) as Array<keyof PollutantData>).forEach(key => {
          const fluctuation = Math.random() * 4 - 2; 
          newPollutants[key] = Math.max(0, Math.round(newPollutants[key] + fluctuation));
        });

        const newAqi = newPollutants.pm25; 
        const { level: newLevel } = getAqiInfo(newAqi);
        
        const dominantPollutantEntry = Object.entries(newPollutants).reduce((a, b) => (a[1] > b[1] ? a : b));
        const dominantPollutantKey = dominantPollutantEntry[0] as keyof PollutantData;
        const newDominantPollutant = POLLUTANT_INFO[dominantPollutantKey]?.name || 'N/A';
        
        return {
          ...currentData,
          current: {
            aqi: newAqi,
            level: newLevel,
            dominantPollutant: newDominantPollutant,
          },
          pollutants: newPollutants,
        };
      });
    }, 3000); 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading, error, airQualityData]);

  const handleSearch = (searchCity: string) => {
    setCity(searchCity);
    fetchData(searchCity);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center text-slate-800 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-shadow">Auracast - Air Quality</h1>
          <p className="text-lg text-slate-700 mt-2">Check the air you breathe, anywhere in the world.</p>
          
          <nav className="flex justify-center space-x-2 mt-4">          

          <button className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors rounded-full hover:bg-black/5 " onClick={() => window.open('./map/mainmap.html')}>MAP</button><br />
          <button className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors rounded-full hover:bg-black/5 " onClick={() => window.open('./community/aura_community.html')}>COMMUNITY</button><br />
          <button className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors rounded-full hover:bg-black/5 " onClick={() => window.open('./symptomTracker/symptom.html')}>SYMPTOM TRACKER</button><br />
          <button className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors rounded-full hover:bg-black/5 " onClick={() => window.open('./route/safePlanner.html')}>ROUTE PLANNER</button><br />
          </nav>
        </header>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        <main className="mt-6">
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {airQualityData && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CurrentWeatherCard data={airQualityData.current} city={airQualityData.city} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <PollutantDetails data={airQualityData.pollutants} />
                <ForecastChart data={airQualityData.forecast} />
              </div>
            </div>
          )}
        </main>
      </div>
       <footer className="w-full max-w-4xl mx-auto text-center text-slate-500 mt-8 text-sm">
        <p>&copy; {new Date().getFullYear()} Auracast. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;