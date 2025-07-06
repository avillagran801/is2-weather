import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "PATCH"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const {
    id
  } = req.body;

  try {
    if( !id ) {
      return res.status(400).json({ error: "Falta el id "});
    }

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        is_account_new: false,
      }
    });

    return res.status(201).json(user);
  }
  catch (error) {
    return res.status(500).json({ error: {error} });
  }

}