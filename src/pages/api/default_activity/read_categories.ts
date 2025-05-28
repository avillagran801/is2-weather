import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "GET") {
    return res.status(405).json({error: "Método no permitido"});
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        user_id: 1,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error obteniendo categorías de admin:", error);
    return res.status(500).json({error: "Error al obtener las categorías predeterminadas" });
  }
}