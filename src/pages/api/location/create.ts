import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { latitude, longitude, name } = req.body;

  try{
    if( isNaN(latitude) || isNaN(longitude) || !name ) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio "});
    }

    const location = await prisma.location.create({
      data : {
        latitude: parseInt(latitude),
        longitude: parseInt(longitude),
        name: name
      }
    });

    return res.status(201).json(location);
  }
  catch(error){
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      if(error.code === "P2002"){
        return res.status(422).json({ error: "Ya existe una entrada con este nombre" });
      }
    }
    else {
      return res.status(500).json({ error: "Error al crear ubicación" });
    }
  }
}  