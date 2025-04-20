import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Activity } from '@/generated/prisma/client';

type CreateActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (activity: Omit<Activity, "id">) => void;
}

const defaultFormValues = {
  name: "",
  temperature: [15, 24] as [number, number],
  rain: "sí"
}

export default function CreateActivityDialog({open, setOpen, onSubmit}: CreateActivityDialogProps) {
  const [formData, setFormData] = React.useState(defaultFormValues);
  
  // Variables asociadas a temperatura
  const minDistance = 1;
  const temperatureMarks = Array.from({ length: 8 }, (_, i) => ({
    value: -30 + i * 10,
    label: `${-30 + i * 10}°C`,
  }));
  
  // Maneja cambios en campos distintos al de temperatura
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTemperatureChange = (event: Event, newValue: number[], activeThumb: number) => {
    if(!Array.isArray(newValue)){
      return;
    }
    
    if (activeThumb === 0) {
      setFormData({
        ...formData,
        temperature: [Math.min(newValue[0], formData.temperature[1] - minDistance), formData.temperature[1]]
      });
    } else {
      setFormData({
        ...formData,
        temperature: [formData.temperature[0], Math.max(newValue[1], formData.temperature[0] + minDistance)]
      });
    }
  };

  const handleClose = () => {
    setOpen(false);

    // Limpia valores cada vez que se cierra
    setFormData(defaultFormValues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      minTemp: formData.temperature[0],
      maxTemp: formData.temperature[1],
      rain: formData.rain === "sí",
      category_id: 1, // CHANGE LATER
    });

    handleClose();
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Crear nueva actividad
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
            Para crear una nueva actividad por favor rellene los campos a continuación.
            </DialogContentText>

            <Box sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem"
            }}>

              {/* Textfield para nombre de la actividad */}
              <TextField
                autoFocus
                required
                margin="dense"
                id="activity-name"
                name="name"
                label="Nombre actividad"
                fullWidth
                variant="standard"
                value={formData.name}
                onChange={handleInputChange}
              />

              {/* Slider para temperatura mínima y máxima de preferencia */}
              <FormControl fullWidth>
                <FormLabel id="temperature-slider-label" required>
                Rango de temperatura
                </FormLabel>

                <Box sx={{
                  px: 2,
                  pt: 1
                }}>
                  <Slider
                    getAriaLabel={() => 'Rango de temperatura'}
                    value={formData.temperature}
                    onChange={handleTemperatureChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={(value) => `${value}°C`}
                    marks={temperatureMarks}
                    min={-30}
                    max={40}
                    disableSwap
                  />
                </Box>
              </FormControl>

              {/* Radio buttons para preferencia de lluvia */}
              <FormControl component="fieldset">
                <FormLabel component="legend" required>
                ¿Se puede realizar con lluvia?
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="rain-preference"
                  name="rain"
                  value={formData.rain}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="sí" control={<Radio />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
