import { NextApiRequest, NextApiResponse } from "next";
import opencage from 'opencage-api-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { city } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City is required' });
  }

  console.log("HOLAAAAAAAAAAA");
  console.log(req.query);

  try {
    const data = await opencage.geocode({ q: city, key: process.env.OPENCAGE_API_KEY! });

    if (data.results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lng } = data.results[0].geometry;
    return res.status(200).json({ lat, lng });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }

}