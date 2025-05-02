import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      include: { Location: true },
    });

    if (!user || !user.Location) {
      return res.status(404).json({ error: "Ubicación del usuario no encontrada" });
    }

    const [city, country] = user.Location.name.split(",").map((s) => s.trim());

    return res.status(200).json({
      city,
      country,
      lat: user.Location.latitude,
      lng: user.Location.longitude,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener ubicación del usuario" });
  }
}
