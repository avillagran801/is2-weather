import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { latitude, longitude } = req.body;

    try {
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Campos 'latitude' o 'longitude' nulos" });
        }

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const data = await response.json();

        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: { error } })
    }
}