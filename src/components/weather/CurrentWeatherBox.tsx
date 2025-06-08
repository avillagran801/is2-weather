import { Box, Typography } from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { WeatherData } from "@/pages/api/weather/consult";

type CardProps = {
  weather: WeatherData | null;
  currentWeatherDescription: string;
}

export default function CurrentWeatherBox({ weather, currentWeatherDescription }: CardProps) {
    return (
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
    );
}