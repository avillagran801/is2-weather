import React from "react";
import { Activity, Category } from "@/generated/prisma/client";
import { Box, Typography, Paper, Grid, Card } from "@mui/material";
import Loading from "@/components/layout/loading";
import GenericActivityCard from "@/components/activities/GenericActivityCard";

export default function Categorias() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, actResponse] = await Promise.all([
          fetch("/api/category/catReadAll"),
          fetch("/api/activity/readAll")
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
        const categoryActivities = activities.filter(
          activity => activity.category_id === category.id
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