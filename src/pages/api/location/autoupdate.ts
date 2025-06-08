import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido'});
  }

  const { user_id, latitude, longitude } = req.body;

  if(!user_id || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Faltan datos de ubicación o usuario'});
  }

  try {
    const apiKey = process.env.OPENCAGE_API_KEY!;
    const query = encodeURIComponent(`${latitude},${longitude}`);
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&language=es`);
    const data = await geoRes.json();

    //console.log('OpenCage API response:', JSON.stringify(data, null, 2));
    
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'No se encontraron resultados para las coordenadas dadas' });
    }
    const components = data.results[0]?.components ?? {};

    const city = 
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      components.municipality ||
      components.county ||
      components.state_district;
    
    const country = components.country; 
    
    if(!city || !country){
      return res.status(400).json({ error: 'No se pudo determinar la ciudad o país'});
    }

    const user = prisma.user.update({
      where: {
        id: Number(user_id)
      },
      data: {
        latitude: latitude,
        longitude: longitude,
        city_name: `${city}, ${country}`,
      }
    });

    return res.status(201).json({
      latitude: (await user).latitude,
      longitude: (await user).longitude,
      city: (await user).city_name,
    });
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error actualizando ubicación con GPS'});
  }
}