import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "El campo 'id' es obligatorio y debe ser un número válido" });
    }

    const deletedActivity = await prisma.activity.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({ message: "Actividad eliminada exitosamente", deletedActivity });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "No se encontró una actividad con el ID proporcionado" });
      }
    }
    return res.status(500).json({ error: "Error al eliminar la actividad" });
  }
}