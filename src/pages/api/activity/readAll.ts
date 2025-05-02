import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export type ActivityWithCategory = Prisma.ActivityGetPayload<{
  include: {
    category: true,
  }  
}>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "GET"){
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const activities = await prisma.activity.findMany({
      include: {
        category: true,
      }
    });

    return res.status(200).json(activities);
  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }
}