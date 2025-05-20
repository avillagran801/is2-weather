import { Box, Card, CardActionArea, CardContent, Typography, IconButton } from "@mui/material";
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DeleteIcon from '@mui/icons-material/Delete';
import { ActivityWithCategories } from "@/pages/api/activity/readByUser";

type CardProps = {
  activity: ActivityWithCategories;
  onClick: () => void;
  onDelete: () => void; // Add a prop for the delete action
}

export default function ActivityCard({ activity, onClick, onDelete }: CardProps) {
  return (
    <>
      <Card sx={{
        height: "100%",
        backgroundColor: "#dad7cd",
        position: "relative", // Enable positioning for the delete button
      }}>
        <CardActionArea onClick={onClick}>
          <CardContent sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "0.5rem"
          }}>
            <Typography
              noWrap = {true}
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
              <Typography sx={{ fontSize: "1rem"}}>
                Min: {activity.minTemp}°C - Max: {activity.maxTemp}°C
              </Typography>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem"
            }}>
              <WbSunnyIcon />
              <Typography sx={{ fontSize: "1rem"}}>
                Lluvia: {activity.rain? "Sí" : "No"}
              </Typography>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem"
            }}>

              {/* CHANGE LATER TO SUPPORT CHIPS */}
              <WbSunnyIcon />
              <Typography sx={{ fontSize: "1rem"}}>
                Categoría: {activity.ActivityCategory[0].Category.name}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>

        <IconButton // Delete button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            onDelete();
          }}
          sx={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.5rem",
            backgroundColor: "#f8d7da",
            "&:hover": {
              backgroundColor: "#f5c6cb",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </>
  );
}