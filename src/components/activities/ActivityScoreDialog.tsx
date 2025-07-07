import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import { WeatherData } from "@/pages/api/weather/consult";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText, SvgIconProps, Typography } from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getPassedConditions } from "@/utils/getPassedConditions";
import StarRating from "@/components/rating/StarRating";
import React from "react";

type ActivityScoreDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: ActivityWithCategories;
  weather: WeatherData;
};

type ConditionItem = {
  icon: React.ElementType<SvgIconProps>;
  label: string;
  passed: boolean | null;
  value: string;
};

export default function ActivityScoreDialog({
  open,
  setOpen,
  selectedActivity,
  weather,
}: ActivityScoreDialogProps) {
  const [rating, setRating] = React.useState(selectedActivity.rating || 0);
  
  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    await fetch(`/api/activity/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedActivity.id, rating: newRating }),
    });
  };


  if (!selectedActivity || !weather) return null;

  const conditions = getPassedConditions(selectedActivity, weather);

  // Define all possible condition items
  const allConditionItems: ConditionItem[] = [
    {
      icon: DeviceThermostatIcon,
      label: "Temperatura",
      passed: conditions.temperature,
      value: `${weather.current.temperature_2m}°C (actividad: ${selectedActivity.minTemp}°C - ${selectedActivity.maxTemp}°C)`
    },
    {
      icon: WaterDropIcon,
      label: "Lluvia",
      passed: conditions.rain,
      value: `${weather.current.rain} mm${selectedActivity.rain ? ` (máx: ${selectedActivity.maxRain ?? "-"} mm)` : ""}`
    },
    {
      icon: OpacityIcon,
      label: "Humedad",
      passed: conditions.humidity,
      value: `${weather.current.relative_humidity_2m}%${selectedActivity.humidity !== null ? ` (máx: ${selectedActivity.humidity}%)` : ""}`
    },
    {
      icon: WbSunnyIcon,
      label: "Índice UV",
      passed: conditions.uv_index,
      value: `${weather.current.uv_index}${selectedActivity.uv_index !== null ? ` (máx: ${selectedActivity.uv_index})` : ""}`
    },
    {
      icon: AcUnitIcon,
      label: "Nieve",
      passed: conditions.snow,
      value: `${weather.current.snowfall} mm${selectedActivity.snow ? ` (máx: ${selectedActivity.maxSnow ?? "-"})` : ""}`
    },
    {
      icon: AirIcon,
      label: "Viento",
      passed: conditions.wind_speed,
      value: `${weather.current.wind_speed_10m} km/h${selectedActivity.wind_speed !== null ? ` (máx: ${selectedActivity.wind_speed} km/h)` : ""}`
    },
    {
      icon: VisibilityIcon,
      label: "Visibilidad",
      passed: conditions.visibility,
      value: `${weather.current.visibility} m${selectedActivity.visibility !== null ? ` (mín: ${selectedActivity.visibility} m)` : ""}`
    }
  ];

  // Only show conditions where passed is not null
  const shownConditionItems = allConditionItems.filter(item => item.passed !== null);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle fontWeight={'fontWeightBold'}>
        Condiciones para "{selectedActivity.name}"
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontWeight="bold">Calificación:</Typography>
          <StarRating value={selectedActivity.rating ?? 0} onChange={handleRatingChange} />
          <Typography variant="body2" color="text.secondary">
            {selectedActivity.rating !== null && selectedActivity.rating !== undefined
              ? selectedActivity.rating.toFixed(1)
              : "Sin calificación"}
          </Typography>
        </Box>
        <List>
          {shownConditionItems.map((item) => (
            <ListItem key={item.label}>
              <ListItemIcon>
                <item.icon color={item.passed ? "success" : "error"} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight="bold" color="text.primary">
                    {item.label}
                  </Typography>
                }
                secondary={
                  <Typography color="text.secondary">
                    {item.value}
                  </Typography>
                }
              />
              {item.passed === true && (
                <CheckCircleIcon color="success" />
              )}
              {item.passed === false && (
                <CancelIcon color="error" />
              )}
            </ListItem>
          ))}
        </List>
        {/* Categorías */}
        <Box sx={{ mt: 2 }}>
          <Typography fontWeight="bold" mb={1}>Categorías:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedActivity.ActivityCategory.map((category) => (
              <Chip
                key={category.Category.id}
                label={category.Category.name}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}