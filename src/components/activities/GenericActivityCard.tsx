import { Activity } from "@/generated/prisma";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

type GenericActivityCardProps = {
  activity: Activity;
};

export default function GenericActivityCard({ activity, children }: GenericActivityCardProps & { children?: React.ReactNode }) {
  return (
    <Card sx={{
      height: "100%",
      backgroundColor: "#edebe4",
    }}>
      <CardContent sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
      }}>
        <Typography
          noWrap={true}
          sx={{
            fontSize: "1.2rem"
          }}
        >
          <b>{activity.name}</b>
        </Typography>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem"
        }}>
          <ThermostatIcon />
          <Typography sx={{ fontSize: "1rem" }}>
            Min: {activity.minTemp}°C - Max: {activity.maxTemp}°C
          </Typography>
        </Box>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem"
        }}>
          <WbSunnyIcon />
          <Typography sx={{ fontSize: "1rem" }}>
            Lluvia: {activity.rain ? "Sí" : "No"}
          </Typography>
        </Box>
      </CardContent>
      {children}
    </Card>
  );
}