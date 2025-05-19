import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export type ActivityWithCategories = Prisma.ActivityGetPayload<{
  include: {
    ActivityCategory: {
      select: {
        Category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    }
  }
}>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "GET"){
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { user_id } = req.query;

    if(!user_id) {
      return res.status(400).json({ error: "Falta user_id" });      
    }

    const activities = await prisma.activity.findMany({
      where: {
        user_id: Number(user_id),
      },
      include: {
        ActivityCategory: {
          select: {
            Category: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    return res.status(200).json(activities);
  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }
}