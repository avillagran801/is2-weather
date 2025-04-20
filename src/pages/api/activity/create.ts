import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { name, minTemp, maxTemp, rain, category_id } = req.body;

  try {
    if( !name ) { // CHECK ALL FIELDS
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    const activity = await prisma.activity.create({
      data: {
        name: name,
        minTemp: parseInt(minTemp),
        maxTemp: parseInt(maxTemp),
        rain: rain === "true"? true : false,
        category_id: parseInt(category_id)
      }
    });

    return res.status(201).json(activity);
  }
  catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      if(error.code === "P2002"){
        return res.status(422).json({ error: "Ya existe una entrada con este nombre" });
      }
    }
    else {
      return res.status(500).json({ error: "Error al crear actividad" });
    }
  }
}