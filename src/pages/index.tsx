import React from "react";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/layout/loading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Clima() {
  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState<any>(null);
  const [location, setLocation] = React.useState<{ city: string; country: string; lat: number; lng: number } | null>(null);

  const weatherCodeDescriptions: { [key: number]: string } = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    56: "Llovizna helada ligera",
    57: "Llovizna helada intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    77: "Granos de nieve",
    80: "Chubascos de lluvia ligeros",
    81: "Chubascos de lluvia moderados",
    82: "Chubascos de lluvia violentos",
    85: "Chubascos de nieve ligeros",
    86: "Chubascos de nieve intensos",
    95: "Tormenta eléctrica (leve o moderada)",
    96: "Tormenta eléctrica con granizo ligero",
    99: "Tormenta eléctrica con granizo intenso",
  };

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        // CHANGE USER_ID LATER
        const locationRes = await fetch("/api/location/read?user_id=2"); // <--- CHANGE THIS
        const locationData = await locationRes.json();
        
        if (!locationRes.ok) {
          throw new Error(locationData.error || "Error obteniendo ubicación");
        }

        const { city, country, lat, lng } = locationData;

        if (!city || !country || lat == null || lng == null) {
          throw new Error("Datos de ubicación inválidos");
        }

        setLocation({ city: city,country: country, lat: lat, lng: lng });

        const response = await fetch("/api/weather/consult", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        setWeather(data);
      } catch (error) {
        console.error("Error al obtener el clima: ", error);
        alert("Error al obtener el clima o la ubicación");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Prepare data for the graphs
  const graphData = weather?.hourly?.temperature_2m?.map((temp: number, index: number) => ({
    hour: `${index}:00`,
    temperature: temp,
    precipitation_probability: weather?.hourly?.precipitation_probability?.[index] || 0,
    relative_humidity: weather?.hourly?.relative_humidity_2m?.[index] || 0,
    uv_index: weather?.hourly?.uv_index?.[index] || 0,
    weatherCode: weatherCodeDescriptions[weather?.hourly?.weather_code?.[index]] || "Desconocido",
  }));

  // Extract current weather data
  const currentTemperature = weather?.current?.temperature_2m;
  const currentWeatherCode = weather?.current?.weather_code;
  const currentWeatherDescription = weatherCodeDescriptions[currentWeatherCode] || "Desconocido";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ padding: 2 }}>
          {/* Current Weather */}
          <Typography variant="h4" gutterBottom>
                        Clima Actual en {location?.city}, {location?.country}
          </Typography>
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h6">
                            Temperatura Actual: {currentTemperature} °C
            </Typography>
            <Typography variant="h6">
                            Condición Actual: {currentWeatherDescription}
            </Typography>
          </Box>

          {graphData ? (
            <>
              {/* Temperature Graph */}
              <Typography variant="h6" gutterBottom>
                                Temperatura
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>

              {/* Precipitation Graph */}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                                Probabilidad de Lluvia
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="precipitation_probability" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>

              {/* Raw Data */}
              <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
                                Datos Crudos
              </Typography>
              <pre>{JSON.stringify(weather, null, 2)}</pre>
              <Typography variant="body2" color="textSecondary">
                                (Los datos crudos pueden contener información adicional sobre el clima.)
              </Typography>
            </>
          ) : (
            <Typography variant="body1">No se encontraron datos de clima.</Typography>
          )}
        </Box>
      )}
    </>
  );
}