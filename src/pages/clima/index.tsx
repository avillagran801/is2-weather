import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Loading from "@/components/layout/loading";

export default function Clima() {
    const [loading, setLoading] = React.useState(true);
    const [weather, setWeather] = React.useState<any>(null);

    const weatherCodeDescriptions: { [key: number]: string } = {
        0: "Despejado",
        1: "Principalmente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
    };

    React.useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch("/api/weather/consult", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude: -36.827, // Latitude for Concepción, Chile
                        longitude: -73.050, // Longitude for Concepción, Chile
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error);
                }

                setWeather(data);
            } catch (error) {
                console.error("Error al obtener el clima: ", error);
                alert("Error al obtener el clima");
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Clima
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
                                <Typography variant="h6">Temperatura Actual</Typography>
                                <Typography variant="body1">
                                    {weather?.current_weather.temperature} °C
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
                                <Typography variant="h6">Condiciones</Typography>
                                <Typography variant="body1">
                                    {weatherCodeDescriptions[weather?.current_weather.weathercode] || "Desconocido"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}