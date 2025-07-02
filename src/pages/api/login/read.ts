import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "POST"){
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

    if(!user){
      return res.status(401).json({ message: "Nombre de usuario inválido" });
    }

    const validPassword = await bcrypt.compare(password, user?.password?? '');

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña inválida" });
    }

    return res.status(200).json("Valid user");

  }
  catch (error) {
    return res.status(500).json({ error: {error} })
  }  
}