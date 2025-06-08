import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Función para obtener coordenadas desde opencage
async function getCoordinates(city: string, country: string) {
  const apiKey = process.env.OPENCAGE_API_KEY!;
  const query = encodeURIComponent(`${city}, ${country}`);
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`);

  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  const { lat, lng } = data.results[0].geometry;
  return { lat, lng };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { city, country, user_id } = req.body;

  if (!city || !country || !user_id) {
    return res.status(400).json({ error: "Falta un parámetro obligatorio" });
  }

  const coords = await getCoordinates(city, country);

  if (!coords) {
    return res.status(404).json({ error: "Ubicación no encontrada" });
  }

  try {
    const user = prisma.user.update({
      where: {
        id: Number(user_id)
      },
      data: {
        latitude: coords.lat,
        longitude: coords.lng,
        city_name: `${city}, ${country}`,
      }
    });

    return res.status(201).json({
      latitude: (await user).latitude,
      longitude: (await user).longitude,
      city_name: (await user).city_name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar ubicación" });
  }
}
