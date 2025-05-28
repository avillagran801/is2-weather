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
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<number[]>([]);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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
      return <Typography>Seleciona una o más actividades</Typography>;
    case 2:
      return <Typography>Confirma tu selección</Typography>;
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
                <Button variant="contained" onClick={handleNext} disabled={activeStep === 0 && selectedCategoryIds.length === 0}>
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