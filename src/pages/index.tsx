import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Loading from "@/components/layout/loading";
import WeatherChart from "@/components/WeatherChart";

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

        setLocation({ city: city, country: country, lat: lat, lng: lng });

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


  // Prepare data for visualization
  const graphData = weather?.hourly?.time?.map((hour: string, index: number) => ({
    hour: hour.split("T")[1], // Extract the time part
    day: hour.split("T")[0], // Extract the date part
    temperature: weather?.hourly?.temperature_2m?.[index] || 0,
    wind_speed: weather?.hourly?.wind_speed_10m?.[index] || 0,
    precipitation: weather?.hourly?.precipitation_probability?.[index] || 0,
    relative_humidity: weather?.hourly?.relative_humidity_2m?.[index] || 0,
    uv_index: weather?.hourly?.uv_index?.[index] || 0,
    weatherCode: weatherCodeDescriptions[weather?.hourly?.weather_code?.[index]] || "Desconocido",
  }));

  // Get current weather description
  const currentWeatherDescription = weatherCodeDescriptions[weather?.current?.weather_code] || "Desconocido";

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
              Temperatura Actual: {weather?.current?.temperature_2m || "Desconocida"} °C
            </Typography>
            <Typography variant="h6">
              Condición Actual: {currentWeatherDescription}
            </Typography>
          </Box>

          {graphData ? (
            <>
              <Typography variant="h6" gutterBottom>
                Pronóstico
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                <WeatherChart />
              </Box>

            </>
          ) : (
            <Typography variant="body1">No se encontraron datos de clima.</Typography>
          )}

          {/* raw json response */}
          <Typography variant="h6" gutterBottom>
            Respuesta JSON de open-meteo:
          </Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(weather, null, 2)}
          </pre>
        </Box>
      )}
    </>
  );
}