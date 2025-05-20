import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Prisma } from "@/generated/prisma";

export type PlainCategory = Prisma.CategoryGetPayload<{
  omit: {
    user_id: true,
  } 
}>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  try {
    const { user_id } = req.query;

    if(!user_id) {
      return res.status(400).json({ error: "Falta user_id" });      
    }

    const categories = await prisma.category.findMany({
      where: {
        user_id: Number(user_id),
      },
      omit: {
        user_id: true,
      }
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: {error} })
  }
}