import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { latitude, longitude } = req.body;
  const url = "https://api.open-meteo.com/v1/forecast";
  let queries = "&hourly=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers" // hourly
  queries += "&forecast_days=2" // forecast days
  queries += "&current=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers"; // current
  queries += "&timezone=America%2FSantiago"; // timezone

  try {
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Campos 'latitude' o 'longitude' nulos" });
    }

    const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}${queries}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}