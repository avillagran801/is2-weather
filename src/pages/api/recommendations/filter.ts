// pages/api/recommendations.ts

import { NextApiRequest, NextApiResponse } from "next";

// Helper
function getAbsoluteUrl(req: NextApiRequest, path: string): string {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000';
    return `${protocol}://${host}${path}`;
}

interface Actividad {
    id: number;
    name: string;
    minTemp: number | null; 
    maxTemp: number | null; 
    rain: boolean; // 
    category_id: number;
}

interface WeatherData {
    current: {
        temperature_2m: number;
        weather_code: number; //  de lluvia
      
    };
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // --- DEFINIR COORDENADAS FIJAS ---
  const fixedLatitude = -36.827;
  const fixedLongitude = -73.050;
  // --------------------------------

  console.log(`API /api/recommendations llamada. Usando coordenadas FIJAS: Lat=${fixedLatitude}, Lon=${fixedLongitude}`);

  try {
    // --- 2. FETCH actividades ---
    console.log("Intentando obtener actividades desde /api/activity/readAll...");
    const activitiesApiUrl = getAbsoluteUrl(req, '/api/activity/readAll');
    const activitiesResponse = await fetch(activitiesApiUrl);

    if (!activitiesResponse.ok) {
      let errorBody = ''; try { errorBody = await activitiesResponse.text(); } catch (e) {}
      console.error(`Error al obtener actividades: ${activitiesResponse.status} ${activitiesResponse.statusText}`, errorBody);
      throw new Error(`Fallo al obtener actividades: ${activitiesResponse.status}`);
    }

    const allActivities: Actividad[] = await activitiesResponse.json();
    console.log(`Actividades obtenidas (${allActivities?.length || 0}) vía fetch.`);
    // console.log("Actividades:", allActivities); 


    // --- 3. FETCH clima ---
    console.log("Intentando obtener clima desde /api/weather/consult..."); 
    const weatherApiUrl = getAbsoluteUrl(req, '/api/weather/consult'); 

    const weatherResponse = await fetch(weatherApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: fixedLatitude, longitude: fixedLongitude }),
    });

    if (!weatherResponse.ok) {
        let errorBody = ''; try { errorBody = await weatherResponse.text(); } catch (e) {}
        console.error(`Error al obtener clima: ${weatherResponse.status} ${weatherResponse.statusText}`, errorBody);
        throw new Error(`Fallo al obtener clima: ${weatherResponse.status}`);
    }

    
    const weatherData: WeatherData = await weatherResponse.json();
    console.log("Datos del clima obtenidos vía fetch (para coords fijas).");
    // console.log("Clima actual:", weatherData.current); 


    // --- 4. FILTRO ---
    
    if (!weatherData?.current?.temperature_2m) {
        console.error("Formato inesperado en weatherData.current:", weatherData?.current);
        throw new Error("No se pudo obtener la temperatura actual del clima.");
    }
    const currentTemp = weatherData.current.temperature_2m;
    // const currentWeatherCode = weatherData.current.weather_code; // lluvia

    console.log(`Filtrando actividades para temperatura actual: ${currentTemp}°C`);

    const actividadesFiltradas = allActivities.filter((actividad: Actividad) => {
        // Lógica de Temperatura:
        // - Si minTemp es null, no hay límite inferior.
        // - Si maxTemp es null, no hay límite superior.
        const tempOk =
            (actividad.minTemp === null || actividad.minTemp <= currentTemp) &&
            (actividad.maxTemp === null || actividad.maxTemp >= currentTemp);


        // Combinar condiciones (por ahora solo temperatura)
        return tempOk; // 
    });

    console.log("Actividades filtradas:", actividadesFiltradas.map(a => a.name)); 


    // --- 5. Respuesta ---
    
    return res.status(200).json(actividadesFiltradas);

  } catch (error) {
    console.error("Error general en /api/recommendations:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    
    // return res.status(500).json([]);
    return res.status(500).json({ error: `Error interno al generar recomendaciones: ${errorMessage}` });
  }
}