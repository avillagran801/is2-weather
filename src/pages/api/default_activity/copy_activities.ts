import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function hanlder(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { user_id, activityIds, categoryMapping } = req.body;

  if (
    typeof user_id !== "number" ||
    !Array.isArray(activityIds) ||
    typeof categoryMapping !== "object"
  ) {
    return res.status(400).json({error: "Parámetros inválidos" });
  }

  try{
    const createdActivities = [];

    for (const activityId of activityIds) {
      const adminActivity = await prisma.activity.findUnique({
        where: {id: activityId},
        include: {
          ActivityCategory: true,
        },
      });

      if (!adminActivity) {
        continue;
      }

      const newActivity = await prisma.activity.create({
        data: {
          name: adminActivity.name,
          minTemp: adminActivity.minTemp,
          maxTemp: adminActivity.maxTemp,
          rain: adminActivity.rain,

          maxRain: adminActivity.maxRain,
          snow: adminActivity.snow,
          maxSnow: adminActivity.maxSnow,
          humidity: adminActivity.humidity,
          uv_index: adminActivity.uv_index,
          wind_speed: adminActivity.wind_speed,
          visibility: adminActivity.visibility,

          user_id,
        },
      });

      const mappedCategories = adminActivity.ActivityCategory.map((ac) => categoryMapping[ac.category_id])
        .filter((id) => id !== undefined);
      
      for (const userCategoryId of mappedCategories) {
        await prisma.activityCategory.create({
          data: {
            activity_id: newActivity.id,
            category_id: userCategoryId,
          },
        });
      }
      createdActivities.push(newActivity);
    }
    return res.status(200).json({ success: true, activititesCreated: createdActivities.length });
  } catch (error) {
    console.error("Error al copiar actividades:", error);
    return res.status(500).json({ error: "Error interno al copiar actividades"});
  }
}