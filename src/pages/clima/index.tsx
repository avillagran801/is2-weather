import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Loading from "@/components/layout/loading";

export default function Clima() {
    const [loading, setLoading] = React.useState(true);
    const [weather, setWeather] = React.useState<any>(null);

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
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Clima Actual
                    </Typography>
                    {weather && weather.hourly && weather.hourly.temperature_2m && weather.hourly.weather_code ? (
                        <>
                            <Grid container spacing={2}>
                                {weather.hourly.temperature_2m.map((temp: number, index: number) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}                                    >
                                        <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 1 }}>
                                            <Typography variant="h6">Hora: {index}:00</Typography>
                                            <Typography variant="body1">Temperatura: {temp} °C</Typography>
                                            <Typography variant="body1">
                                                Estado del tiempo: {weatherCodeDescriptions[weather.hourly.weather_code[index]] || "Desconocido"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <Typography variant="body1">No se encontraron datos de clima.</Typography>
                    )}
                </Box>
            )}
        </>
    );
}