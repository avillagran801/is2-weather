import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { id, name, minTemp, maxTemp, rain, category_id } = req.body;

  try {
    if( !id || !name || isNaN(minTemp) || isNaN(maxTemp) || rain === undefined || !category_id ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    console.log("UPDATE ENDPOINT");
    console.log(req.body);

    const activity = await prisma.activity.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        minTemp: parseInt(minTemp),
        maxTemp: parseInt(maxTemp),
        rain: rain === "true",
        category_id: parseInt(category_id),
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
      return res.status(500).json({ error: "Error al editar actividad" });
    }
  }
}