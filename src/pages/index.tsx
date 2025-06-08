import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Loading from "@/components/layout/loading";
import WeatherChart from "@/components/weather/WeatherChart";
import { ActivityWithCategories } from "./api/activity/readByUser";
import GenericActivityCard from "@/components/activities/GenericActivityCard";
import { getWeatherCodeDescriptions } from "@/utils/weatherCodeDescriptions";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinearProgress from "@mui/material/LinearProgress";

type ScoredActivity = ActivityWithCategories & {
  score: number;
  maxScore: number;
};

export default function Clima() {
  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState<any>(null);
  const [location, setLocation] = React.useState<{ city: string; country: string; lat: number; lng: number } | null>(null);
  const [recommendedActivities, setRecommendedActivities] = React.useState<ScoredActivity[]>([]);

  const calculateActivityScores = async (currentWeather: any) => {
    try {
      const response = await fetch("/api/activity/readByUser?user_id=2");
      const activities: ActivityWithCategories[] = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const scoredActivities = activities.map(activity => {
        console.log("de nuevo")
        let score = 0;
        let maxScore = 4; // + 1 for each optional condition that is defined

        // Check temperature (2 points)
        if (currentWeather.current.temperature_2m >= activity.minTemp &&
          currentWeather.current.temperature_2m <= activity.maxTemp) {
          score += 2;
          console.log(1);
        }

        // Check rain condition (2 point)
        const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(currentWeather.current.weather_code);
        if (!isRaining || (isRaining && activity.rain)) {
          score += 2;
          console.log(2);
        }

        // Rain amount check (1 point)
        if (activity.maxRain !== null) {
          maxScore += 1;
          if (activity.maxRain >= currentWeather.current.rain) {
            score += 1;
            console.log(3);
          }
        }

        // Check humidity
        if (activity.humidity !== null) {
          maxScore += 1;
          if (activity.humidity >= currentWeather.current.relative_humidity_2m) {
            score += 1;
            console.log(4);
          }
        }

        // Check UV index
        if (activity.uv_index !== null) {
          maxScore += 1;
          if (activity.uv_index >= currentWeather.current.uv_index) {
            score += 1;
            console.log(5);
          }
        }

        // Snow presence check (1 point)
        const isSnowing = [71, 73, 75, 77, 85, 86].includes(currentWeather?.weather_code);
        if (activity.snow !== null) {
          maxScore += 1;
          if (!isSnowing || (isSnowing && activity.snow)) {
            score += 1;
            console.log(6);
          }
        }

        // Snow amount check (1 point)
        if (activity.maxSnow !== null) {
          maxScore += 1;
          if (activity.maxSnow >= currentWeather.current.snowfall) {
            score += 1;
            console.log(7);
          }
        }

        // Check wind speed
        if (activity.wind_speed !== null) {
          maxScore += 1;
          if (activity.wind_speed >= currentWeather.current.wind_speed_10m) {
            score += 1;
            console.log(8);
          }
        }

        // Check visibility
        if (activity.visibility !== null) {
          maxScore += 1;
          if (activity.visibility <= currentWeather.current.visibility) {
            score += 1;
            console.log(9);
          }
        }


        return { ...activity, score, maxScore };
      });
      // Sort by score and get top 3
      const topActivities = scoredActivities
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setRecommendedActivities(topActivities);
    } catch (error) {
      console.error("Error calculating recommendations:", error);
    }
  };

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
        await calculateActivityScores(data);
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
  const currentWeatherDescription = getWeatherCodeDescriptions(weather?.current?.weather_code, weather?.current?.is_day);

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
              mb: 4,
              bgcolor: "#edebe4",
              borderRadius: 2,
              px: 3,
              py: 2,
              boxShadow: 1,
              justifyContent: "space-between"
            }}
          >
            {/* Descripción del clima */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {currentWeatherDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {weather?.current?.time?.replace("T", " ")}
              </Typography>
            </Box>
            {/* Condiciones actuales */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ThermostatIcon color="primary" />
                <Typography variant="body1">
                  {weather?.current?.temperature_2m ?? "--"}°C
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WaterDropIcon color="primary" />
                <Typography variant="body1">
                  {weather?.current?.precipitation ?? "--"} mm
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <OpacityIcon color="primary" />
                <Typography variant="body1">
                  {weather?.current?.relative_humidity_2m ?? "--"}%
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WbSunnyIcon color="primary" />
                <Typography variant="body1">
                  UV {weather?.current?.uv_index ?? "--"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AirIcon color="primary" />
                <Typography variant="body1">
                  {weather?.current?.wind_speed_10m ?? "--"} km/h
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VisibilityIcon color="primary" />
                <Typography variant="body1">
                  {weather?.current?.visibility ?? "--"} m
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Actividades Recomendadas
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {recommendedActivities.map((activity) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                <Box sx={{ position: 'relative' }}>
                  <GenericActivityCard activity={activity} />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    Puntaje: {activity.score} / {activity.maxScore}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={activity.maxScore > 0 ? (activity.score / activity.maxScore) * 100 : 0}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#f8f8f8",
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main',
                      },
                      mt: 1,
                      width: '120px',
                      position: "absolute",
                      top: 40,
                      right: 8,
                    }}
                  />
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