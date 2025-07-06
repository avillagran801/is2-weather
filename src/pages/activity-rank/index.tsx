import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Loading from "@/components/layout/loading";
import ScoredActivityCard from "@/components/activities/ScoredActivityCard";
import ActivityScoreDialog from "@/components/activities/ActivityScoreDialog";
import { ScoredActivity, calculateActivityScores } from "@/utils/calculateActivityScores";
import { WeatherData } from "../api/weather/consult";

export default function ActivityRankPage() {
    const [loading, setLoading] = React.useState(true);
    const [weather, setWeather] = React.useState<WeatherData | null>(null);
    const [activities, setActivities] = React.useState<ScoredActivity[]>([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // CHANGE USER_ID LATER
                const locationRes = await fetch("/api/location/read?user_id=2");
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

                const activitiesRes = await fetch("/api/activity/readByUser?user_id=2");
                const activitiesData = await activitiesRes.json();
                if (!activitiesRes.ok) throw new Error(activitiesData.error || "Error obteniendo actividades");

                let scored = calculateActivityScores(activitiesData, weatherData);
                scored.sort((a, b) => b.score - a.score);
                setActivities(scored);
            } catch (error) {
                alert("Error cargando actividades o clima");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 4}}>
                        Ranking de Actividades
                    </Typography>
                    <Grid container spacing={2}>
                        {activities.map((activity) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                                <Box sx={{ position: 'relative', height: "100%" }}>
                                    <ScoredActivityCard
                                        activity={activity}
                                        onVerMas={() => { setSelectedActivity(activity); setDialogOpen(true); }}
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