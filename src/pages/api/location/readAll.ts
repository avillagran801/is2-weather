import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "GET"){
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const locations = await prisma.location.findMany();

    return res.status(200).json(locations);
  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }
}