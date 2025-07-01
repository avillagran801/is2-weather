import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "GET"){
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { username, password } = req.body;
  
  try{
    if(!username || !password) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio"});
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username
      },
    });


  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }  

}