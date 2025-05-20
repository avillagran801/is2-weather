import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import Loading from "@/components/layout/loading";
import GenericActivityCard from "@/components/activities/GenericActivityCard";
import { ActivityWithCategories } from "../api/activity/readByUser";
import { PlainCategory } from "../api/category/readByUser";

export default function Categorias() {
  const [categories, setCategories] = React.useState<PlainCategory[]>([]);
  const [activities, setActivities] = React.useState<ActivityWithCategories[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // CHANGE USER_ID LATER
        const [catResponse, actResponse] = await Promise.all([
          fetch("/api/category/readByUser?user_id=2"), // <--- CHANGE THIS
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
  }, []);

  if (loading) return <Loading />;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
        Actividades por Categoría
      </Typography>

      {categories.map((category) => {
        // CHANGE LATER: EDIT TO SUPPORT MORE THAN ONE CATEGORY
        const categoryActivities = activities.filter(
          activity => activity.ActivityCategory[0].Category.id === category.id // <--- CHANGE THIS
        );

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
  );
}