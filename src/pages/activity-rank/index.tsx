import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Loading from "@/components/layout/Loading";
import ScoredActivityCard from "@/components/activities/ScoredActivityCard";
import ActivityScoreDialog from "@/components/activities/ActivityScoreDialog";
import { ScoredActivity, calculateActivityScores } from "@/utils/calculateActivityScores";
import { WeatherData } from "../api/weather/consult";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ActivityRankPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [activities, setActivities] = React.useState<ScoredActivity[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<ScoredActivity | null>(null);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/iniciar-sesion");
    }
  }, [status, session, router]);

  React.useEffect(() => {
    if (status !== "authenticated" || !session?.user.id) return;

    const fetchData = async () => {
      try {

        const locationRes = await fetch(`/api/location/read?user_id=${session.user.id}`);
        const locationData = await locationRes.json();
        if (!locationRes.ok) throw new Error(locationData.error || "Error obteniendo ubicación");

        const { lat, lng } = locationData;
        const weatherRes = await fetch("/api/weather/consult", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        });
        const weatherData = await weatherRes.json();
        if (!weatherRes.ok) throw new Error(weatherData.error);

        setWeather(weatherData);

        const activitiesRes = await fetch(`/api/activity/readByUser?user_id=${session.user.id}`);
        const activitiesData = await activitiesRes.json();
        if (!activitiesRes.ok) throw new Error(activitiesData.error || "Error obteniendo actividades");

        const scored = calculateActivityScores(activitiesData, weatherData);
        scored.sort((a, b) => b.score - a.score);
        setActivities(scored);
      } catch (error) {
        alert(error + "Error cargando actividades o clima");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user.id, status]);

  const handleRatingChange = async (id: number, newRating: number) => {
    setActivities(prev =>
      prev.map(act => act.id === id ? { ...act, rating: newRating } : act)
    );
    if (selectedActivity && selectedActivity.id === id) {
      setSelectedActivity({ ...selectedActivity, rating: newRating });
    }
    await fetch(`/api/activity/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, rating: newRating }),
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Ranking de Actividades
          </Typography>
          <Grid container spacing={2}>
            {activities.map((activity) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                <Box sx={{ position: 'relative', height: "100%" }}>
                  <ScoredActivityCard
                    activity={activity}
                    onVerMas={() => { setSelectedActivity(activity); setDialogOpen(true); }}
                    onRatingChange={handleRatingChange}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          {selectedActivity && weather && (
            <ActivityScoreDialog
              open={dialogOpen}
              setOpen={setDialogOpen}
              selectedActivity={selectedActivity}
              weather={weather}
            />
          )}
        </Box>
      )}
    </>
  );
}