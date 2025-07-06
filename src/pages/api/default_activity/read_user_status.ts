import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "GET"){
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { user_id } = req.query;

    if(!user_id) {
      return res.status(400).json({ error: "Falta user_id" });      
    }

    const status = await prisma.user.findUnique({
      where: {
        id: Number(user_id as string),
      },
      select: {
        is_account_new: true,
      }
    });

    return res.status(200).json(status);
  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }
}