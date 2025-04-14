import React from "react";
import ActivityCard from "@/components/activities/ActivityCard";
import { Box, Grid, Typography } from "@mui/material";
import CreateActivityDialog from "@/components/activities/CreateActivityDialog";

// Eventualmente este tipo debería venir de la base de datos por Prisma
export type Activity = {
  id: string;
  name: string;
  minTemp: number;
  maxTemp: number;
  rain: boolean;
}

export default function MisActividades() {
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const handleAddActivity = (newActivity: Omit<Activity, "id">) => {
    setActivities((prev) => [
      ...prev,
      {
        ...newActivity,
        id: crypto.randomUUID(), // Eventualmente esto lo debería hacer la base de datos
      }
    ]);
  };

  return(
    <>
      <Box sx={{
        margin: "1rem"
      }}>
        <Typography variant="h6">
          Mis actividades
        </Typography>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 12, sm: 6, md: 4}}
          >
            <ActivityCard
              title="Crear actividad"
              customColor="lightgreen"
              onClick={() => {setOpenCreateDialog(true)}}
            />
          </Grid>
          {
            activities.map((activity) => (
              <Grid
                key={activity.id}
                size={{ xs: 12, sm: 6, md: 4}}
              >
                <ActivityCard
                  title={activity.name}
                  onClick={() => {}}
                />
              </Grid>
            ))
          }
        </Grid>
      </Box>
      <CreateActivityDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSubmit={handleAddActivity}
        existingActivities={activities}
      />
    </>
  );
}