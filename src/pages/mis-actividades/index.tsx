import React from "react";
import ActivityCard from "@/components/activities/ActivityCard";
import { Box, Grid, Typography, Button } from "@mui/material";
import CreateActivityDialog from "@/components/activities/CreateActivityDialog";
import Loading from "@/components/layout/Loading";
import EditActivityDialog from "@/components/activities/EditActivityDialog";
import { ActivityWithCategories } from "../api/activity/readByUser";
import { PlainCategory } from "../api/category/readByUser";
import { ActivityCreatePayload, ActivityEditPayload } from "@/lib/activities_utils/defaultNewActivity";
import { defaultActivity } from "@/lib/activities_utils/defaultActivity";
import DetailsActivityDialog from "@/components/activities/DetailsActivityDialog";
import DeleteActivityDialog from "@/components/activities/DeleteActivityDialog";
import { useRouter } from "next/router";
import SearchAndCreateBar from "@/components/layout/SearchAndCreateBar";

export default function MisActividades() {
  const [activities, setActivities] = React.useState<ActivityWithCategories[]>([]);
  const [categories, setCategories] = React.useState<PlainCategory[]>([]);

  const [refreshActivities, setRefreshActivities] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const [openDetailsDialog, setOpenDetailsDialog] = React.useState(false);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [selectedActivity, setSelectedActivity] = React.useState<ActivityWithCategories>(defaultActivity);

  const router = useRouter();

  // Fetch all activities associated with the user
  React.useEffect(() => {
    const fetchActivities = async() => {
      try {
        // CHANGE USER_ID LATER
        const response = await fetch("/api/activity/readByUser?user_id=2"); // <--- CHANGE THIS
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

    fetchActivities();
  }, [refreshActivities]);

  // Fetch all categories associated with the user
  React.useEffect(() => {
    const fetchCategories = async() => {
      try {
        // CHANGE USER_ID LATER
        const response = await fetch("/api/category/readByUser?user_id=2");
        const data = await response.json();

        if(!response.ok){
          throw new Error(data.error);
        }

        setCategories(data);
      }
      catch (error) {
        console.error("Error al obtener categorías: ", error);
        alert("Error al obtener categorías");
      }
    }

    fetchCategories();
  }, []);

  const handleAddActivity = async (newActivity: ActivityCreatePayload) => {
    try {
      if( !newActivity.name ) {
        throw new Error("La actividad necesita un nombre");
      }

      if(newActivity.minTemp > newActivity.maxTemp) {
        throw new Error("La temperatura mínima no puede ser mayor que la temperatura máxima");        
      }

      // CHANGE USER_ID LATER
      const response = await fetch("/api/activity/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({         
          ...newActivity,
          user_id: 2, // <--- CHANGE THIS 
          categories_id: newActivity.categories_id,
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
      alert("Error al crear la actividad")
    }
  };

  const handleEditActivity = async (editedActivity: ActivityEditPayload) => {
    try {
      if( !editedActivity.name ) {
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      const response = await fetch("/api/activity/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedActivity,
          categories_id: editedActivity.categories_id,
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

  const handleDeleteActivity = async (deletedActivityId: number) => {
    try {
      const response = await fetch("/api/activity/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deletedActivityId,
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

  // TERMINAR DE IMPLEMENTAR
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
  };

  if(loading) {
    return(
      <Loading />
    )
  }

  return(
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 2}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/setup")}
        >
              Seleccionar actividades predeterminadas
        </Button>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        margin: "1rem",
        gap: "1rem"
      }}>
        <Typography variant="h5">
          Mis actividades
        </Typography>
        <SearchAndCreateBar
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          buttonText="Crear actividad"
          onButtonClick={() => {setOpenCreateDialog(true)}}
        />

        <Grid container spacing={2} alignItems="stretch">
          {
            activities.map((activity) => (
              <Grid
                key={activity.id}
                size={{ xs: 12, sm: 6, md: 4}}
              >
                <ActivityCard
                  activity={activity}
                  onClick={() => {setSelectedActivity(activity); setOpenDetailsDialog(true)}}
                />
              </Grid>
            ))
          }
        </Grid>
      </Box>

      <DetailsActivityDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        setOpenEditDialog={setOpenEditDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        selectedActivity={selectedActivity}
      />
      <CreateActivityDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSubmit={handleAddActivity}
        userCategories={categories}
      />
      <EditActivityDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        selectedActivity={selectedActivity}
        onSubmit={handleEditActivity}
        userCategories={categories}
      />
      <DeleteActivityDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        onSubmit={handleDeleteActivity}
        selectedActivity={selectedActivity}
      />
    </>
  );
}