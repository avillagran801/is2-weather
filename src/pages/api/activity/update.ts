import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// CHANGE LATER: EDIT TO SUPPORT MORE THAN ONE CATEGORY
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { id, name, minTemp, maxTemp, rain, category_id, user_id } = req.body;

  try {
    if( !id || !name || isNaN(minTemp) || isNaN(maxTemp) || rain === undefined || !category_id || !user_id ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    // Delete existing relations between the activity and the category
    await prisma.activityCategory.deleteMany({
      where: {
        activity_id: parseInt(id),
      },
    });

    const activity = await prisma.activity.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        minTemp: parseInt(minTemp),
        maxTemp: parseInt(maxTemp),
        rain: rain === "true" || rain === true,

        // Create relationship between the activity and an existing category
        ActivityCategory: {
          create: {
            category_id: parseInt(category_id),
          }
        }
      }
    });

    return res.status(201).json(activity);
  }
  catch (error) {
    return res.status(500).json({ error: {error} });
  }
}