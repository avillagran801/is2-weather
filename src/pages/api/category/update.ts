import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "PATCH"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { id, name, activities_id } = req.body;

  try {
    if( !id || !name || !activities_id ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    if (!Array.isArray(activities_id)) {
      return res.status(400).json({ error: "activities_id debe ser un arreglo" });
    }

    // Delete existing relations between the category and the past activities
    await prisma.activityCategory.deleteMany({
      where: {
        category_id: parseInt(id),
      },
    });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,

        // Create relationship between the category and the selected activities
        ActivityCategory: {
          createMany: {
            data: activities_id.map((id: string) => ({ activity_id: Number(id) })),
          }
        }
      }
    });

    return res.status(201).json(category);
  }
  catch (error) {
    return res.status(500).json({ error: {error} });
  }
}