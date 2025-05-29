import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { latitude, longitude } = req.body;
  const url = "https://api.open-meteo.com/v1/forecast";
  let queries = "&hourly=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers,precipitation" // hourly
  queries += "&forecast_days=2" // forecast days
  queries += "&current=temperature_2m,weather_code,uv_index,relative_humidity_2m,visibility,wind_speed_10m,snowfall,rain,showers,precipitation"; // current
  queries += "&timezone=auto"; // timezone

  try {
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Campos 'latitude' o 'longitude' nulos" });
    }

    const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}${queries}`);
    let data = await response.json();
    
    //////// reformating data ////////
    
    // separate date and time in hourly.time
    if (data.hourly && data.hourly.time) {
      let date = data.hourly.time.map((time: string) => time.split("T")[0]);
      let hour = data.hourly.time.map((time: string) => time.split("T")[1]);
      data.hourly.time = hour;
      data.hourly.date = date;
    }

    // reformat date from YYYY-MM-DD to DD MMM
    if (data.hourly && data.hourly.date) {
      data.hourly.date = data.hourly.date.map((date: string) => {
        const [year, month, day] = date.split("-");
        return `${day} ${new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short' })}`;
      });
    }


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