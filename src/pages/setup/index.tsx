import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Container,
  Paper
} from "@mui/material";

const steps = [
  "Seleccionar categorías",
  "Seleccionar actividades",
  "Confirmar asociación",
];

export default function Setup(){
  const [categories, setCategories] = React.useState<{ id: number, name:string }[]>([]);
  const [activities, setActivities] = React.useState<{id: number, name:string}[]>([]);  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<number[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = React.useState<number[]>([]);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/default_activity/read_categories");
        if (!res.ok) throw new Error("Error fetching categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las categorías.");
      }
    };

    fetchCategories();
  }, []);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try{
        const res = await fetch("/api/default_activity/read_activities", {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({ categoryIds: selectedCategoryIds}),
        });
        if (!res.ok) throw new Error("Error fetching activities");
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las actividades");
      }
    };
    if (activeStep === 1 && selectedCategoryIds.length > 0) {
      fetchActivities();
    }
  }, [activeStep, selectedCategoryIds]);

  const handleNext = async () => {
    if (activeStep === 2) {
      try {
        const user_id = 2; // CHANGE THIS

        const catRes = await fetch("/api/default_activity/copy_categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, categoryIds: selectedCategoryIds }),
        });

        if (!catRes.ok) throw new Error("Error al copiar categorías");
        const { categoryMapping } = await catRes.json();

        const actRes = await fetch("/api/default_activity/copy_activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            activityIds: selectedActivityIds,
            categoryMapping,
          }),
        });

        if (!actRes.ok) throw new Error("Error al copiar actividades");

        setActiveStep((prevStep) => prevStep + 1);
      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al finalizar la configuración.");
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };


  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
    case 0:
      return (
        <>
          <Typography>Selecciona una o más categorías</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2}}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryIds.includes(category.id) ? "contained": "outlined"}
                onClick={() => {
                  setSelectedCategoryIds((prev) =>
                    prev.includes(category.id)
                      ? prev.filter((id) => id !== category.id)
                      : [...prev, category.id]
                  );
                }}
              >
                {category.name}
              </Button>
            ))}
          </Box>
        </>
      );
    case 1:
      return (
        <>
          <Typography>Seleciona una o más actividades</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2}}>
            {activities.map((activity => (
              <Button
                key={activity.id}
                variant={selectedActivityIds.includes(activity.id) ? "contained": "outlined"}
                onClick={() => {
                  setSelectedActivityIds((prev) =>
                    prev.includes(activity.id)
                      ? prev.filter((id) => id !== activity.id)
                      : [...prev, activity.id]
                  );
                }}
              >
                {activity.name}
              </Button>
            )))}
          </Box>
        </>
      ); 
    case 2:
      const selectedCategoryNames = categories
        .filter((cat) => selectedCategoryIds.includes(cat.id))
        .map((cat) => cat.name);

      const selectedActivityNames = activities
        .filter((act) => selectedActivityIds.includes(act.id))
        .map((act) => act.name);

      return (
        <>
          <Typography variant="h6" gutterBottom>Categorías seleccionadas</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {selectedCategoryNames.map((name, index) => (
              <Paper key={index} sx={{ p: 1 }}>{name}</Paper>
            ))}
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Actividades seleccionadas</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {selectedActivityNames.map((name, index) => (
              <Paper key={index} sx={{ p: 1 }}>{name}</Paper>
            ))}
          </Box>
        </>
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx = {{ p: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) =>(
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mb: 2 }}>
                Actividades asociadas correctamente
              </Typography>
              <Button onClick={handleReset}>Volver a empezar</Button>
            </>
          ) : (
            <>
              {renderStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4}}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Atrás
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNext} 
                  disabled={
                    (activeStep === 0 && selectedCategoryIds.length === 0) ||
                    (activeStep === 1 && selectedActivityIds.length === 0)
                  }
                >
                  {activeStep === steps.length -1 ? "Finalizar" : "Siguiente"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  )
}