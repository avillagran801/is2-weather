import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Método no permitido" });    
  }

  const { username, password } = req.body;

  try {
    if(!username || !password) {
      return res.status(400).json({ error: "Falta al menos un campo obligatorio"});
    }

    if(password.length < 4){
      return res.status(400).json({ error: "La contraseña debe tener por lo menos 4 caracteres"});      
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        latitude: -36.8785069,
        longitude: -73.1467503,
        city_name: "San Pedro de la Paz, Chile",
        is_account_new: true,
      }
    });

    return res.status(201).json(user);
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(500).json({ error: "Ya existe un usuario con ese nombre" });
      }
    }

    return res.status(500).json({ error: {error} });
  }
}