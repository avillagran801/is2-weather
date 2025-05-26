import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';
import { Box, Chip, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material';
import { PlainCategory } from '@/pages/api/category/readByUser';
import { ActivityWithCategories } from '@/pages/api/activity/readByUser';

export type ActivityCreatePayload = Omit<ActivityWithCategories, "id" | "user_id" | "ActivityCategory"> & {
  categories_id: number[];
};

type CreateActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (activity: ActivityCreatePayload) => void;
  userCategories: PlainCategory[];
}

// CHANGE LATER
const defaultFormValues = {
  name: "",
  temperature: [15, 24] as [number, number],
  rain: false,
  categories_id: [] as string[],
}

export default function CreateActivityDialog({open, setOpen, onSubmit, userCategories}: CreateActivityDialogProps) {
  const [formData, setFormData] = React.useState(defaultFormValues);
  const [defaultWeather, setDefaultWeather] = React.useState<null | number>(null);
  const [openOptional, setOpenOptional] = React.useState(false);
  
  // Maneja cambios en textfields y radio buttons
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultipleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];

    setFormData({
      ...formData,
      categories_id: value
    });
  };

  const handleDefaultWeatherChange = (event: React.MouseEvent<HTMLElement>, newDefaultWeather: number) => {
    if(newDefaultWeather === null){
      setDefaultWeather(null);
      return;
    }
    
    setDefaultWeather(newDefaultWeather);

    if(newDefaultWeather === 0){
      setFormData({
        ...formData,
        temperature: [18,35],
        rain: false,
      });
    }
    if(newDefaultWeather === 1){
      setFormData({
        ...formData,
        temperature: [0,18],
        rain: false,
      });
    }
    if(newDefaultWeather === 2){
      setFormData({
        ...formData,
        temperature: [0,18],
        rain: true,
      });
    }
    if(newDefaultWeather === 3){
      setFormData({
        ...formData,
        temperature: [-20,0],
        rain: true,
      });
    }
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenOptional(event.target.checked);
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
      rain: formData.rain,
      categories_id: formData.categories_id.map(Number),
    });

    handleClose();
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle
          fontWeight={'fontWeightBold'}
          sx={{
            background: "#a3b18a" // Change later
          }}
        >
          Crear nueva actividad
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem"
          }}>
            <Typography
              gutterBottom={true}
              variant="body1"
            >
              Para crear una nueva actividad por favor rellene los campos a continuación.              
            </Typography>

            <Typography fontWeight={'fontWeightBold'}>
              Sobre la actividad
            </Typography>

            <Box sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem"
            }}>
              {/* Textfield para nombre de la actividad */}
              <TextField
                autoFocus
                required
                margin="dense"
                id="activity-name"
                name="name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                label="Nombre"
              />

              {/* Selector de categoría ya existente para la actividad */}
              <FormControl>
                <InputLabel id="category-label" required sx={{background: "white"}}>Categoría(s)</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Categoría(s)"
                  multiple
                  value={formData.categories_id}
                  onChange={handleMultipleSelectChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category_name = userCategories.find((cat) => cat.id === Number(value))?.name;
                        return(
                          <Chip key={value} label={category_name} />
                        );
                      })}
                    </Box>
                  )}
                >
                  {userCategories.map((category) => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography fontWeight={'fontWeightBold'}>
                Sobre las condiciones climatológicas
              </Typography>

              <Typography>
                Puedes seleccionar alguno de los ajustes predeterminados y continuar editando los parámetros.
              </Typography>

              <ToggleButtonGroup
                value={defaultWeather}
                onChange={handleDefaultWeatherChange}
                exclusive
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ToggleButton value={0}>
                  <WbSunnyIcon />
                </ToggleButton>
                <ToggleButton value={1}>
                  <CloudIcon />
                </ToggleButton>
                <ToggleButton value={2}>
                  <WaterDropIcon />
                </ToggleButton>
                <ToggleButton value={3}>
                  <AcUnitIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Slider para temperatura mínima y máxima de preferencia */}
              <Box>
                Min: {formData.temperature[0]} - Max: {formData.temperature[1]}
              </Box>
              <Box>
                Lluvia: {formData.rain? "sí" : "no"}
              </Box>
              <Box>
                Preset: {defaultWeather}
              </Box>
 
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

              <Box>
                <Box>
                  <FormControlLabel
                    control={<Switch checked={openOptional} onChange={handleSwitchChange} />}
                    label="Incluir parámetros opcionales"
                  />
                </Box>

              </Box>

              {openOptional && 
              <Box>
                HOLA, AQUÍ VAN LOS NUEVOS PARÁMETROS
              </Box>
              }
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
