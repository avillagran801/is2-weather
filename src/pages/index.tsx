import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Loading from "@/components/layout/loading";
import WeatherChart from "@/components/weather/WeatherChart";
// import weatherCodeDescriptions from "@/utils/weatherCodeDescriptions";
import { time } from "console";

export default function Clima() {
  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState<any>(null);
  const [location, setLocation] = React.useState<{ city: string; country: string; lat: number; lng: number } | null>(null);

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
  const timeData = weather?.hourly?.time || [];
  const minutes = String(new Date().getMinutes()).padStart(2, "0")
  const currentTimeData = weather?.current?.time.slice(0, -2).concat(minutes) || []; // adjusted minutes to be more precise
  const temperatureData = weather?.hourly?.temperature_2m || [];
  const precipitationData = weather?.hourly?.precipitation || [];
  const weatherCodeData = weather?.hourly?.weather_code || [];
  const isDayData = weather?.hourly?.is_day || [];

  // Get current weather description
  // const currentWeatherDescription = weatherCodeDescriptions[weather?.current?.weather_code][weather?.current?.is_day] || "Desconocido";

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
              {/* Condición Actual: {currentWeatherDescription} */}
            </Typography>
          </Box>

          {/* Weather Graph */}
          {timeData ? (
            <>
              <Typography variant="h6" gutterBottom>
                Pronóstico del Clima
              </Typography>
              <Box sx={{ marginBottom: 4, width: "80%", alignContent: "center", margin: "0 auto" }}>
                <WeatherChart
                  time={timeData}
                  currentTime={currentTimeData}
                  temperature={temperatureData}
                  precipitation={precipitationData}
                  weatherCode={weatherCodeData}
                  isDay={isDayData} />
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