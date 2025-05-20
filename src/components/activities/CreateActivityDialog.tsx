import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { Box, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent } from '@mui/material';
import { temperatureMarks, temperatureMinDistance } from '@/lib/activities_utils/temperature';
import { PlainCategory } from '@/pages/api/category/readByUser';
import { ActivityWithCategories } from '@/pages/api/activity/readByUser';

export type ActivityCreatePayload = Omit<ActivityWithCategories, "id" | "user_id" | "ActivityCategory"> & {
  categories_id: number[];
};

type CreateActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (activity: ActivityCreatePayload) => void;
  categories: PlainCategory[];
}

// CHANGE LATER
const defaultFormValues = {
  name: "",
  temperature: [15, 24] as [number, number],
  rain: false,
  category_id: 0,
}

export default function CreateActivityDialog({open, setOpen, onSubmit, categories}: CreateActivityDialogProps) {
  const [formData, setFormData] = React.useState(defaultFormValues);
  
  // Maneja cambios en textfields y radio buttons
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja cambios en selector
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const value = Number(e.target.value as string);
    setFormData({...formData, category_id: value})
  }

  const handleTemperatureChange = (event: Event, newValue: number[], activeThumb: number) => {
    if(!Array.isArray(newValue)){
      return;
    }
    
    if (activeThumb === 0) {
      setFormData({
        ...formData,
        temperature: [Math.min(newValue[0], formData.temperature[1] - temperatureMinDistance), formData.temperature[1]]
      });
    } else {
      setFormData({
        ...formData,
        temperature: [formData.temperature[0], Math.max(newValue[1], formData.temperature[0] + temperatureMinDistance)]
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

    // CHANGE LATER: EDIT TO SUPPORT MORE THAN ONE CATEGORY
    onSubmit({
      name: formData.name,
      minTemp: formData.temperature[0],
      maxTemp: formData.temperature[1],
      rain: formData.rain,
      categories_id: [ // <--- CHANGE THIS
        formData.category_id,
      ]
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

              {/* Selector de categoría ya existente para la actividad */}
              <FormControl>
                <InputLabel>
                  Categoría
                </InputLabel>
                <Select<number>
                  labelId="select-label"
                  id="category"
                  value={formData.category_id}
                  label="Categoría"
                  onChange={handleSelectChange}
                  required
                >
                  {categories && categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}                  
                </Select>
              </FormControl>

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
                  <FormControlLabel value={true} control={<Radio />} label="Sí" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
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
