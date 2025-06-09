import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Loading from "@/components/layout/Loading";
import WeatherChart from "@/components/weather/WeatherChart";
import CurrentWeatherBox from "@/components/weather/CurrentWeatherBox";
import ScoredActivityCard from "@/components/activities/ScoredActivityCard";
import { getWeatherCodeDescriptions } from "@/utils/weatherCodeDescriptions";
import { ScoredActivity, calculateActivityScores } from "@/utils/calculateActivityScores";
import { WeatherData } from "./api/weather/consult";

export default function MainPage() {
  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [location, setLocation] = React.useState<{ city: string; country: string; lat: number; lng: number } | null>(null);
  const [recommendedActivities, setRecommendedActivities] = React.useState<ScoredActivity[]>([]);


  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const shouldAutoUpdate = localStorage.getItem("rememberLocationUpdate") === "true";

        if (shouldAutoUpdate) {
          await fetch('/api/location/autoupdate', {
            method: "POST",
          });
        }

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

  React.useEffect(() => {
    if (!weather) return; // Solo ejecuta si weather está disponible

    const fetchActivities = async () => {
      try {
        // CHANGE USER_ID LATER
        const response = await fetch("/api/activity/readByUser?user_id=2"); // <--- CHANGE THIS
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error obteniendo actividades");
        }

        let scoredActivities = calculateActivityScores(data, weather);   // Calculate scores for each activity
        scoredActivities.sort((a, b) => b.score - a.score);              // Sort activities by score in descending order
        scoredActivities = scoredActivities.slice(0, 3);                 // Limit to top 3 activities

        setRecommendedActivities(scoredActivities);                      // Set the top 3 scored activities
      } catch (error) {
        console.error("Error al obtener actividades: ", error);
        alert("Error al obtener actividades");
      }
    }
    fetchActivities();
  }, [weather]);


  // Prepare data for visualization
  const timeData = weather?.hourly?.time || [];
  const minutes = String(new Date().getMinutes()).padStart(2, "0")
  const currentTimeData = weather?.current?.time.slice(0, -2).concat(minutes) || ""; // adjusted minutes to be more precise
  const temperatureData = weather?.hourly?.temperature_2m || [];
  const precipitationData = weather?.hourly?.precipitation || [];
  const weatherCodeData = weather?.hourly?.weather_code || [];
  const isDayData = weather?.hourly?.is_day || [];

  // Get current weather description
  const currentWeatherDescription = getWeatherCodeDescriptions(weather?.current?.weather_code || -1, weather?.current?.is_day);

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
          <CurrentWeatherBox
            weather={weather}
            currentWeatherDescription={currentWeatherDescription}
          />
          {/* Recommended Activities */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Actividades Recomendadas
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {recommendedActivities.map((activity) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                <Box sx={{ position: 'relative' }}>
                  <ScoredActivityCard activity={activity} />
                </Box>
              </Grid>
            ))}
          </Grid>
          {/* Weather Graph */}
          {timeData ? (
            <>
              <Typography variant="h6" gutterBottom>
                Pronóstico del Clima
              </Typography>
              <Box
                sx={{
                  marginBottom: 4,
                  width: "85%",
                  alignContent: "center",
                  margin: "0 auto",
                  bgcolor: "#edebe4",
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 2
                }}
              >
                <WeatherChart
                  time={timeData}
                  currentTime={currentTimeData}
                  temperature={temperatureData}
                  precipitation={precipitationData}
                  weatherCode={weatherCodeData}
                  isDay={isDayData}
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1">No se encontraron datos de clima.</Typography>
          )}

        </Box >
      )
      }
    </>
  );
}