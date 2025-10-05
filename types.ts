
export interface CurrentData {
  aqi: number;
  level: string;
  dominantPollutant: string;
}

export interface PollutantData {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface ForecastDay {
  day: string;
  aqi: number;
}

export interface AirQualityData {
  city: string;
  current: CurrentData;
  pollutants: PollutantData;
  forecast: ForecastDay[];
}
