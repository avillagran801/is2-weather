import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import Loading from "@/components/layout/loading";
import GenericActivityCard from "@/components/activities/GenericActivityCard";
import { ActivityWithCategories } from "../api/activity/readByUser";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog";
import { CategoryCreatePayload } from "@/lib/categories_utils/defaultNewCategory";
import { CategoryWithActivities } from "../api/category/readWithActivitiesByUser";

export default function Categorias() {
  const [categories, setCategories] = React.useState<CategoryWithActivities[]>([]);
  const [activities, setActivities] = React.useState<ActivityWithCategories[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [refreshCategories, setRefreshCategories] = React.useState(false);

  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // CHANGE USER_ID LATER
        const [catResponse, actResponse] = await Promise.all([
          fetch("/api/category/readWithActivitiesByUser?user_id=2"), // <--- CHANGE THIS
          fetch("/api/activity/readByUser?user_id=2") // <--- CHANGE THIS
        ]);

        const [catData, actData] = await Promise.all([
          catResponse.json(),
          actResponse.json()
        ]);

        if (!catResponse.ok) throw new Error(catData.message);
        if (!actResponse.ok) throw new Error(actData.message);

        setCategories(catData);
        setActivities(actData);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCategories]);

  const handleAddCategory = async (newCategory: CategoryCreatePayload) => {
    try {
      if(!newCategory.name) {
        throw new Error("La categoría necesita un nombre");
      }

      // CHANGE USER_ID LATER
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({         
          ...newCategory,
          user_id: 2, // <--- CHANGE THIS 
          activities_id: newCategory.activities_id,
        })
      });      

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");
      }

      setRefreshCategories(true);
      setLoading(true);
    }
    catch (error) {
      console.log(error);
      alert("Error al crear la categoría")
    }
  }

  if (loading) return <Loading />;

  console.log(categories)

  return (
    <>
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
          Actividades por Categoría
        </Typography>
        <Button onClick={() => setOpenCreateDialog(true)}>
          Crear categoría
        </Button>

        {categories.map((category) => {
          // CHANGE LATER: EDIT TO SUPPORT MORE THAN ONE CATEGORY
          const categoryActivities = category.ActivityCategory.map((activity) => (activity.Activity));

          return (
            <Paper 
              key={category.id}
              elevation={2}
              sx={{ marginBottom: "2rem", overflow: "hidden" }}
            >
              {/* Category Header */}
              <Box sx={{ backgroundColor: "#344e41", padding: "1rem" }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  {category.name}
                </Typography>
              </Box>
              <Grid container spacing={2} padding={2} alignItems={"stretch"}>
                {categoryActivities.map((activity) => (
                  <Grid 
                    key={activity.id}
                    sx={{ xs: 12, sm: 6, md: 4}}  
                  >
                    <Box 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <GenericActivityCard activity={activity} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          );
        })}
      </Box>
      <CreateCategoryDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSubmit={handleAddCategory}
        userActivities={activities}
      />
    </>
  );
}