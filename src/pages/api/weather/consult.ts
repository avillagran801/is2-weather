import { NextApiRequest, NextApiResponse } from "next";

export type WeatherData = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    weather_code: string;
    uv_index: string;
    relative_humidity_2m: string;
    visibility: string;
    wind_speed_10m: string;
    snowfall: string;
    rain: string;
    showers: string;
    precipitation: string;
    is_day: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
    uv_index: number;
    relative_humidity_2m: number;
    visibility: number;
    wind_speed_10m: number;
    snowfall: number;
    rain: number;
    showers: number;
    precipitation: number;
    is_day: number;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    weather_code: string;
    uv_index: string;
    relative_humidity_2m: string;
    visibility: string;
    wind_speed_10m: string;
    snowfall: string;
    rain: string;
    showers: string;
    precipitation: string;
    is_day: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    uv_index: number[];
    relative_humidity_2m: number[];
    visibility: number[];
    wind_speed_10m: number[];
    snowfall: number[];
    rain: number[];
    showers: number[];
    precipitation: number[];
    is_day: number[];
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { latitude, longitude } = req.body;
  const url = "https://api.open-meteo.com/v1/forecast";
  let queries = "&hourly=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers,precipitation,is_day" // hourly
  queries += "&forecast_days=3" // forecast days
  queries += "&current=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers,precipitation,is_day"; // current
  queries += "&timezone=auto"; // timezone

  try {
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Campos 'latitude' o 'longitude' nulos" });
    }

    const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}${queries}`);
    let data = await response.json();
    
    // add showers to rain and delete showers
    if (data.hourly && data.hourly.rain) {
      data.hourly.rain = data.hourly.rain.map((value: number, index: number) => {
        return value + (data.hourly.showers ? data.hourly.showers[index] : 0);
      });
      delete data.hourly.showers;
    }
    if (data.current && data.current.rain) {
      data.current.rain = data.current.rain + (data.current.showers || 0);
      delete data.current.showers;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}