import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// CHANGE LATER: EDIT TO SUPPORT MORE THAN ONE CATEGORY
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { name, minTemp, maxTemp, rain, category_id, user_id } = req.body;

  try {
    if( !name || isNaN(minTemp) || isNaN(maxTemp) || rain === undefined || !category_id || !user_id ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    const activity = await prisma.activity.create({
      data: {
        name: name,
        minTemp: parseInt(minTemp),
        maxTemp: parseInt(maxTemp),
        rain: rain === "true" || rain === true,

        // Connect activity to existing user
        User: {
          connect: {
            id: user_id,
          }
        },

        // Create relationship between the activity and an existing category
        ActivityCategory: {
          create: {
            category_id: category_id,
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