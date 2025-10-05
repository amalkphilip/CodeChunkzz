import type { AirQualityData } from '../types';

const MOCK_DATA: { [key: string]: AirQualityData } = {
  'new york': {
    city: 'New York',
    current: { aqi: 45, level: 'Good', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 45, pm10: 20, o3: 30, no2: 15, so2: 5, co: 2 },
    forecast: [
      { day: 'Mon', aqi: 48 }, { day: 'Tue', aqi: 52 }, { day: 'Wed', aqi: 55 },
      { day: 'Thu', aqi: 49 }, { day: 'Fri', aqi: 45 }, { day: 'Sat', aqi: 60 },
      { day: 'Sun', aqi: 58 }
    ],
  },
  'london': {
    city: 'London',
    current: { aqi: 78, level: 'Moderate', dominantPollutant: 'NO₂' },
    pollutants: { pm25: 65, pm10: 78, o3: 40, no2: 88, so2: 12, co: 4 },
    forecast: [
      { day: 'Mon', aqi: 80 }, { day: 'Tue', aqi: 75 }, { day: 'Wed', aqi: 82 },
      { day: 'Thu', aqi: 90 }, { day: 'Fri', aqi: 85 }, { day: 'Sat', aqi: 77 },
      { day: 'Sun', aqi: 72 }
    ],
  },
  'tokyo': {
    city: 'Tokyo',
    current: { aqi: 110, level: 'Unhealthy for Sensitive Groups', dominantPollutant: 'O₃' },
    pollutants: { pm25: 95, pm10: 80, o3: 110, no2: 70, so2: 20, co: 6 },
    forecast: [
      { day: 'Mon', aqi: 115 }, { day: 'Tue', aqi: 120 }, { day: 'Wed', aqi: 105 },
      { day: 'Thu', aqi: 112 }, { day: 'Fri', aqi: 125 }, { day: 'Sat', aqi: 130 },
      { day: 'Sun', aqi: 118 }
    ],
  },
  'sydney': {
    city: 'Sydney',
    current: { aqi: 25, level: 'Good', dominantPollutant: 'O₃' },
    pollutants: { pm25: 15, pm10: 25, o3: 28, no2: 10, so2: 4, co: 1 },
    forecast: [
      { day: 'Mon', aqi: 30 }, { day: 'Tue', aqi: 28 }, { day: 'Wed', aqi: 22 },
      { day: 'Thu', aqi: 25 }, { day: 'Fri', aqi: 35 }, { day: 'Sat', aqi: 32 },
      { day: 'Sun', aqi: 29 }
    ],
  },
  'delhi': {
    city: 'Delhi',
    current: { aqi: 185, level: 'Unhealthy', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 185, pm10: 150, o3: 90, no2: 110, so2: 40, co: 10 },
    forecast: [
        { day: 'Mon', aqi: 190 }, { day: 'Tue', aqi: 205 }, { day: 'Wed', aqi: 180 },
        { day: 'Thu', aqi: 175 }, { day: 'Fri', aqi: 195 }, { day: 'Sat', aqi: 210 },
        { day: 'Sun', aqi: 200 }
    ],
  },
  'kottayam': {
    city: 'Kottayam',
    current: { aqi: 82, level: 'Moderate', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 82, pm10: 45, o3: 60, no2: 35, so2: 10, co: 5 },
    forecast: [
      { day: 'Mon', aqi: 85 }, { day: 'Tue', aqi: 78 }, { day: 'Wed', aqi: 90 },
      { day: 'Thu', aqi: 88 }, { day: 'Fri', aqi: 81 }, { day: 'Sat', aqi: 75 },
      { day: 'Sun', aqi: 83 }
    ],
  },
  'kanjirapally': {
    city: 'Kanjirapally',
    current: { aqi: 86, level: 'Moderate', dominantPollutant: 'O₃' },
    pollutants: { pm25: 86, pm10: 75, o3: 89, no2: 79, so2: 10, co: 5 },
    forecast: [
      { day: 'Mon', aqi: 80 }, { day: 'Tue', aqi: 55 }, { day: 'Wed', aqi: 62 },
      { day: 'Thu', aqi: 85 }, { day: 'Fri', aqi: 48 }, { day: 'Sat', aqi: 56 },
      { day: 'Sun', aqi: 81 }
    ],
  },
  'palakkad': {
    city: 'Palakkad',
    current: { aqi: 125, level: 'Unhealthy for Sensitive Groups', dominantPollutant: 'PM10' },
    pollutants: { pm25: 110, pm10: 125, o3: 80, no2: 65, so2: 25, co: 8 },
    forecast: [
      { day: 'Mon', aqi: 130 }, { day: 'Tue', aqi: 122 }, { day: 'Wed', aqi: 118 },
      { day: 'Thu', aqi: 135 }, { day: 'Fri', aqi: 140 }, { day: 'Sat', aqi: 128 },
      { day: 'Sun', aqi: 120 }
    ],
  },
  'eranakulam': {
    city: 'Eranakulam',
    current: { aqi: 98, level: 'Moderate', dominantPollutant: 'NO₂' },
    pollutants: { pm25: 85, pm10: 98, o3: 70, no2: 95, so2: 18, co: 7 },
    forecast: [
      { day: 'Mon', aqi: 102 }, { day: 'Tue', aqi: 95 }, { day: 'Wed', aqi: 90 },
      { day: 'Thu', aqi: 105 }, { day: 'Fri', aqi: 110 }, { day: 'Sat', aqi: 98 },
      { day: 'Sun', aqi: 92 }
    ],
  },
  'thiruvananthapuram': {
    city: 'Thiruvananthapuram',
    current: { aqi: 75, level: 'Moderate', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 75, pm10: 50, o3: 40, no2: 30, so2: 15, co: 4 },
    forecast: [
      { day: 'Mon', aqi: 78 }, { day: 'Tue', aqi: 72 }, { day: 'Wed', aqi: 80 },
      { day: 'Thu', aqi: 85 }, { day: 'Fri', aqi: 70 }, { day: 'Sat', aqi: 68 },
      { day: 'Sun', aqi: 74 }
    ],
  },
  'kochi': {
    city: 'Kochi',
    current: { aqi: 95, level: 'Moderate', dominantPollutant: 'NO₂' },
    pollutants: { pm25: 80, pm10: 95, o3: 65, no2: 92, so2: 22, co: 8 },
    forecast: [
      { day: 'Mon', aqi: 98 }, { day: 'Tue', aqi: 105 }, { day: 'Wed', aqi: 90 },
      { day: 'Thu', aqi: 88 }, { day: 'Fri', aqi: 92 }, { day: 'Sat', aqi: 100 },
      { day: 'Sun', aqi: 96 }
    ],
  },
  'kozhikode': {
    city: 'Kozhikode',
    current: { aqi: 65, level: 'Moderate', dominantPollutant: 'PM10' },
    pollutants: { pm25: 55, pm10: 65, o3: 45, no2: 25, so2: 10, co: 3 },
    forecast: [
      { day: 'Mon', aqi: 68 }, { day: 'Tue', aqi: 62 }, { day: 'Wed', aqi: 70 },
      { day: 'Thu', aqi: 75 }, { day: 'Fri', aqi: 60 }, { day: 'Sat', aqi: 58 },
      { day: 'Sun', aqi: 64 }
    ],
  },
  'thrissur': {
    city: 'Thrissur',
    current: { aqi: 55, level: 'Moderate', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 55, pm10: 30, o3: 50, no2: 20, so2: 8, co: 2 },
    forecast: [
      { day: 'Mon', aqi: 58 }, { day: 'Tue', aqi: 52 }, { day: 'Wed', aqi: 60 },
      { day: 'Thu', aqi: 65 }, { day: 'Fri', aqi: 50 }, { day: 'Sat', aqi: 48 },
      { day: 'Sun', aqi: 54 }
    ],
  },
  'los angeles': {
    city: 'Los Angeles',
    current: { aqi: 120, level: 'Unhealthy for Sensitive Groups', dominantPollutant: 'O₃' },
    pollutants: { pm25: 100, pm10: 85, o3: 120, no2: 75, so2: 18, co: 7 },
    forecast: [
      { day: 'Mon', aqi: 125 }, { day: 'Tue', aqi: 130 }, { day: 'Wed', aqi: 115 },
      { day: 'Thu', aqi: 110 }, { day: 'Fri', aqi: 122 }, { day: 'Sat', aqi: 128 },
      { day: 'Sun', aqi: 118 }
    ],
  },
  'chicago': {
    city: 'Chicago',
    current: { aqi: 88, level: 'Moderate', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 88, pm10: 60, o3: 70, no2: 55, so2: 10, co: 5 },
    forecast: [
      { day: 'Mon', aqi: 90 }, { day: 'Tue', aqi: 85 }, { day: 'Wed', aqi: 95 },
      { day: 'Thu', aqi: 82 }, { day: 'Fri', aqi: 80 }, { day: 'Sat', aqi: 88 },
      { day: 'Sun', aqi: 92 }
    ],
  },
  'toronto': {
    city: 'Toronto',
    current: { aqi: 48, level: 'Good', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 48, pm10: 22, o3: 35, no2: 18, so2: 5, co: 1 },
    forecast: [
      { day: 'Mon', aqi: 50 }, { day: 'Tue', aqi: 45 }, { day: 'Wed', aqi: 55 },
      { day: 'Thu', aqi: 42 }, { day: 'Fri', aqi: 40 }, { day: 'Sat', aqi: 48 },
      { day: 'Sun', aqi: 52 }
    ],
  },
  'mexico city': {
    city: 'Mexico City',
    current: { aqi: 160, level: 'Unhealthy', dominantPollutant: 'PM2.5' },
    pollutants: { pm25: 160, pm10: 140, o3: 110, no2: 90, so2: 35, co: 12 },
    forecast: [
      { day: 'Mon', aqi: 165 }, { day: 'Tue', aqi: 170 }, { day: 'Wed', aqi: 155 },
      { day: 'Thu', aqi: 150 }, { day: 'Fri', aqi: 162 }, { day: 'Sat', aqi: 168 },
      { day: 'Sun', aqi: 158 }
    ],
  }
};

export const getAirQualityData = (city: string): Promise<AirQualityData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DATA[city.toLowerCase()];
      if (data) {
        resolve(JSON.parse(JSON.stringify(data))); 
      } else {
        reject(new Error(`Could not find air quality data for "${city}". Try "New York", "London", "Tokyo", "Sydney", "Delhi", "Kottayam", "Kanjirapally", "Palakkad", "Eranakulam", "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Los Angeles", "Chicago", "Toronto", or "Mexico City".`));
      }
    }, 1000);
  });
};

export const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { color: 'bg-green-500', textColor: 'text-green-800', level: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (aqi <= 100) return { color: 'bg-yellow-400', textColor: 'text-yellow-800', level: 'Moderate', description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' };
  if (aqi <= 150) return { color: 'bg-orange-500', textColor: 'text-orange-800', level: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi <= 200) return { color: 'bg-red-500', textColor: 'text-red-800', level: 'Unhealthy', description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi <= 300) return { color: 'bg-purple-600', textColor: 'text-purple-100', level: 'Very Unhealthy', description: 'Health alert: The risk of health effects is increased for everyone.' };
  return { color: 'bg-maroon-800', textColor: 'text-maroon-100', level: 'Hazardous', description: 'Health warning of emergency conditions: everyone is more likely to be affected.' };
};

export const POLLUTANT_INFO = {
  pm25: { name: 'PM2.5', unit: 'µg/m³', description: 'Fine Particulate Matter' },
  pm10: { name: 'PM10', unit: 'µg/m³', description: 'Particulate Matter' },
  o3: { name: 'O₃', unit: 'ppb', description: 'Ozone' },
  no2: { name: 'NO₂', unit: 'ppb', description: 'Nitrogen Dioxide' },
  so2: { name: 'SO₂', unit: 'ppb', description: 'Sulphur Dioxide' },
  co: { name: 'CO', unit: 'ppm', description: 'Carbon Monoxide' },
};