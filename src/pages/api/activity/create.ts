import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const {
    user_id,
    name,
    minTemp,
    maxTemp,
    rain,
    maxRain,
    snow,
    maxSnow,
    humidity,
    uv_index,
    wind_speed,
    visibility,
    categories_id,
  } = req.body;

  try {
    if( !name || isNaN(minTemp) || isNaN(maxTemp) || rain === undefined || !categories_id || !user_id ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    if (!Array.isArray(categories_id)) {
      return res.status(400).json({ error: "categories_id debe ser un arreglo" });
    }

    const activity = await prisma.activity.create({
      data: {
        name: name,
        minTemp: parseInt(minTemp),
        maxTemp: parseInt(maxTemp),
        rain: rain === "true" || rain === true,
        maxRain: maxRain != null? parseInt(maxRain) : null,
        snow: (snow === "null" || snow === null)? null : (snow === "true" || snow === true),
        maxSnow: parseInt(maxSnow),
        humidity: parseInt(humidity),
        uv_index: parseInt(uv_index),
        wind_speed: parseInt(wind_speed),
        visibility: parseInt(visibility),
        
        // Connect activity to existing user
        User: {
          connect: {
            id: parseInt(user_id),
          }
        },

        // Create relationship between the activity and existing categories
        ActivityCategory: {
          createMany: {
            data: categories_id.map((id: string) => ({ category_id: Number(id) })),
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