import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST") {
    return res.status(405).json({error: "Método no permitido" });
  }

  const { user_id, categoryIds } = req.body;

  if(
    typeof user_id !== "number" ||
    !Array.isArray(categoryIds) ||
    categoryIds.length === 0
  ){
    return res.status(400).json({ error: "Parámetros inválidos" });
  }

  try{
    const adminCategories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        user_id: 1,
      },
    });

    const idMapping: { [key: number]: number} = {};

    for (const adminCat of adminCategories) {
      const newCategory = await prisma.category.create({
        data: {
          name: adminCat.name,
          user_id,
        },
      });

      idMapping[adminCat.id] = newCategory.id;
    }

    return res.status(200).json({ success: true, categoryMapping: idMapping});
  } catch (error) {
    console.error("Error al copiar categorías", error);
    return res.status(500).json({ error: "Error interno al copiar categorías" });
  }
}