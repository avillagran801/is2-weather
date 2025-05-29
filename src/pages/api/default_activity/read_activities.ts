import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido "});
  }

  const { categoryIds } = req.body;

  if(!Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).json({error: "Se requiere una lista de IDs de categorías" });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        user_id:1,
        ActivityCategory: {
          some: {
            category_id: {
              in: categoryIds,
            },
          },
        },
      },
      include: {
        ActivityCategory: {
          select: {
            category_id: true,
          },
        },
      },
    });

    const formattedActivities = activities.map((activity) => ({
      ...activity,
      categories_id: activity.ActivityCategory.map((ac) => ac.category_id),
    }));

    return res.status(200).json(formattedActivities);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    return res.status(500).json({error: "Error al obtener las actividades predeterminadas"});
  }
}