import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  const { id, rating } = req.body;
  if (!id || typeof rating !== "number") {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }
  try {
    const updated = await prisma.activity.update({
      where: { id: Number(id) },
      data: { rating },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error + "  Error al actualizar el rating" });
  }
}