import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { latitude, longitude } = req.body;
    const url = "https://api.open-meteo.com/v1/forecast";
    const queries = "&hourly=temperature_2m,weather_code,relative_humidity_2m,precipitation_probability,uv_index&forecast_days=3";

    try {
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Campos 'latitude' o 'longitude' nulos" });
        }

        const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}${queries}`);
        const data = await response.json(); // Parse the response as JSON

        return res.status(200).json(data); // Return the parsed JSON
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}