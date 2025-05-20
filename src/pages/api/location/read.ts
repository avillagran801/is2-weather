import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { user_id } = req.query;

    if(!user_id) {
      return res.status(400).json({ error: "Falta user_id" });      
    }

    const location = await prisma.user.findUnique({
      where: {
        id: Number(user_id),
      },
      select: {
        latitude: true,
        longitude: true,
        city_name: true,
      }
    });

    if(location){
      const [city, country] = location?.city_name.split(",").map((s) => s.trim());

      return res.status(200).json({
        city,
        country,
        lat: location.latitude,
        lng: location.longitude,
      });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener ubicación del usuario" });
  }
}