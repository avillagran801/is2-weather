import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { user_id, name, activities_id } = req.body;

  try {
    if(!user_id || !name || !activities_id) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});      
    }

    if (!Array.isArray(activities_id)) {
      return res.status(400).json({ error: "activities_id debe ser un arreglo" });
    }

    const category = await prisma.category.create({
      data: {
        name: name,

        // Connect activity to existing user
        User: {
          connect: {
            id: parseInt(user_id),
          }
        },

        // Create relationship between the category and existing activities
        ActivityCategory: {
          createMany: {
            data: activities_id.map((id: string) => ({ activity_id: Number(id) }))
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