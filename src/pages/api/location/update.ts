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

  const { city, country } = req.body;

  if (!city || !country) {
    return res.status(400).json({ error: "Faltan ciudad o país" });
  }

  const coords = await getCoordinates(city, country);

  if (!coords) {
    return res.status(404).json({ error: "Ubicación no encontrada" });
  }

  try {
    const locationName = `${city}, ${country}`;

    const location = await prisma.location.upsert({
      where: { name: locationName },
      update: {
        latitude: coords.lat,
        longitude: coords.lng,
      },
      create: {
        name: locationName,
        latitude: coords.lat,
        longitude: coords.lng,
      },
    });

    // índice por defecto para un usuario de momento
    const userId = 1;

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        location_id: location.id,
      },
      create: {
        id: userId,
        name: "Default User",
        location_id: location.id,
      },
    });

    return res.status(200).json({
      latitude: coords.lat,
      longitude: coords.lng,
      name: locationName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar ubicación" });
  }
}
