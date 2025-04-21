import React from "react";
import { Activity } from "@/generated/prisma/client";
import ActivityCard from "@/components/activities/ActivityCard";
import { Box, Grid, Typography } from "@mui/material";
import CreateActivityDialog from "@/components/activities/CreateActivityDialog";
import CreateActivityCard from "@/components/activities/CreateActivityCard";
import Loading from "@/components/layout/loading";
import EditActivityDialog from "@/components/activities/EditActivityDialog";

export default function MisActividades() {
  const [activities, setActivities] = React.useState<Activity[]>([]);

  const [refreshActivities, setRefreshActivities] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const [selectedActivity, setSelectedActivity] = React.useState<Activity>({
    id: 0,
    name: "",
    minTemp: 0,
    maxTemp: 0,
    rain: false,
    category_id: 0,
  });

  React.useEffect(() => {
    const fetchActivities = async() => {
      try {
        const response = await fetch("/api/activity/readAll");
        const data = await response.json();

        if(!response.ok){
          throw new Error(data.error);
        }

        setActivities(data);
      } catch (error) {
        console.error("Error al obtener actividades: ", error);
        alert("Error al obtener actividades");
      } finally {
        setRefreshActivities(false);
        setLoading(false);
      }
    };

    fetchActivities()
  }, [refreshActivities]);


  const handleAddActivity = async (newActivity: Omit<Activity, "id">) => {
    try {
      if( !newActivity.name ) {
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      const response = await fetch("/api/activity/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newActivity.name,
          minTemp: newActivity.minTemp,
          maxTemp: newActivity.maxTemp,
          rain: newActivity.rain, // Se envía como string, así que la conversión ocurre en el endpoint
          category_id: 1, // CHANGE LATER
        })
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");
      }

      setRefreshActivities(true);
      setLoading(true);
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error){
        alert(error.message);
      }
    }
  };

  const handleEditActivity = async (editedActivity: Activity) => {
    try {
      if( !editedActivity.name ) {
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      const response = await fetch("/api/activity/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editedActivity.id,
          name: editedActivity.name,
          minTemp: editedActivity.minTemp,
          maxTemp: editedActivity.maxTemp,
          rain: editedActivity.rain, // Se envía como string, así que la conversión ocurre en el endpoint
          category_id: editedActivity.category_id,
        })
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");  
      }

      setRefreshActivities(true);
      setLoading(true);
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error){
        alert(error.message);
      }
    }
  };

  return(
    <>
      {loading?
        <Loading />
        : 
        <>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            margin: "1rem",
            gap: "1rem"
          }}>
            <Typography variant="h5">
            Mis actividades
            </Typography>
            <Grid container spacing={2} alignItems="stretch">
              <Grid
                size={{ xs: 12, sm: 6, md: 4}}
              >
                <CreateActivityCard
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
                      activity={activity}
                      onClick={() => {setSelectedActivity(activity); setOpenEditDialog(true)}}
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
          />
          <EditActivityDialog
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            selectedActivity={selectedActivity}
            onSubmit={handleEditActivity}
          />
        </>
      }
    </>
  );
}