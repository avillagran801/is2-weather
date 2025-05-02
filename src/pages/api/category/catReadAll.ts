import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  try {
    const categories = await prisma.category.findMany();

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorias' });
    }

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: {error} })
  }
}