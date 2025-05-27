import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Chip, Dialog, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material';
import { PlainCategory } from '@/pages/api/category/readByUser';
import { defaultWeatherOptions, WeatherOption } from '@/lib/activities_utils/defaultWeather';
import { ActivityCreateForm } from '@/lib/activities_utils/defaultNewActivity';
import CustomTextfield from '../form/CustomTextfield';
import CustomRadioButton from '../form/CustomRadioButton';

type BaseActivityFormProps = {
  formTitle: string;
  formSubmitText: string;
  formData: ActivityCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<ActivityCreateForm>>;
  optionalSettings: boolean;
  setOptionalSettings:  React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  userCategories: PlainCategory[];
}

export default function BaseActivityForm({
  open,
  handleClose,
  handleSubmit,
  formTitle,
  formSubmitText,
  formData,
  setFormData,
  optionalSettings,
  setOptionalSettings,
  userCategories
}: BaseActivityFormProps) {
  // const [formData, setFormData] = React.useState(defaultNewActivity);
  const [defaultWeather, setDefaultWeather] = React.useState<null | string>(null);
  
  // Maneja cambios en textfields y radio buttons
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const parsedValue = value === "true" ? true : value === "false" ? false : value;

    setFormData({ ...formData, [name]: parsedValue });
  };
  
  // Maneja cambios en selector múltiple de categorías
  const handleCategoriesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];

    setFormData({
      ...formData,
      categories_id: value
    });
  };

  // Maneja cambios en los ajustes predeterminados de clima
  const handleDefaultWeatherChange = (event: React.MouseEvent<HTMLElement>, newDefaultWeather: string) => {
    if(newDefaultWeather === null){
      setDefaultWeather(null);
      return;
    }

    const weatherOption = defaultWeatherOptions.find((option) => option.name === newDefaultWeather) as WeatherOption;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, icon, ...weatherValues } = weatherOption;

    setFormData({
      ...formData,
      ...weatherValues
    })

    setDefaultWeather(newDefaultWeather);
  }

  // Maneja cambios en textfields numéricos
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = Number(value);
    let isValid;

    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if(name === "minTemp" || name === "maxTemp"){
      // Permite entradas vacías o un menos temporalmente
      if (value === "-") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }

      isValid = Number.isInteger(numberValue) && numberValue >= -40 && numberValue <= 40;
    }

    if(name === "maxRain"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 300;      
    }

    if(name === "maxSnow"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 200;            
    }

    if(name === "humidity"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 100;            
    }    

    if(name === "uv_index"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 40; 
    }

    if(name === "wind_speed"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 400;       
    }

    if(name === "visibility"){
      isValid = Number.isInteger(numberValue) && numberValue >= 0 && numberValue <= 10000;         
    }

    if (!isValid) return;

    setFormData((prev) => ({ ...prev, [name]: numberValue }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionalSettings(event.target.checked);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          fontWeight={'fontWeightBold'}
        >
          {formTitle}
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
              {/* Nombre de la actividad */}
              <CustomTextfield
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Nombre"
                required
              />

              {/* Selector de categorías ya existentes para la actividad */}
              <FormControl>
                <InputLabel id="category-label" required sx={{background: "white"}}>Categoría(s)</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Categoría(s)"
                  multiple
                  value={formData.categories_id}
                  onChange={handleCategoriesChange}
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

              {/* Opciones de clima predeterminado */}
              <ToggleButtonGroup
                value={defaultWeather}
                onChange={handleDefaultWeatherChange}
                exclusive
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {
                  defaultWeatherOptions.map(option => {
                    const Icon = option.icon
                    return(
                      <ToggleButton key={option.name} value={option.name}>
                        <Icon />
                      </ToggleButton>
                    );
                  })
                }
              </ToggleButtonGroup>

              {/* Temperatura mínima y máxima */}
              <Box sx={{
                display: "flex",
                gap: "1rem"
              }}>
                <CustomTextfield
                  id="minTemp"
                  value={formData.minTemp}
                  onChange={handleNumberInputChange}
                  label="Temperatura mínima"
                  endAdornment="°C"
                  number={true}
                  placeholder="-40 a 40"
                  required
                />
                <CustomTextfield
                  id="maxTemp"
                  value={formData.maxTemp}
                  onChange={handleNumberInputChange}
                  label="Temperatura máxima"
                  endAdornment="°C"
                  number={true}
                  placeholder="-40 a 40"
                  required
                />
              </Box>        
 
              {/* Preferencia de lluvia */}
              <CustomRadioButton
                id="rain"
                value={formData.rain}
                onChange={handleInputChange}
                label="¿Se puede realizar con lluvia?"
                required
              />

              <Box>
                <FormControlLabel
                  control={<Switch checked={optionalSettings} onChange={handleSwitchChange} />}
                  label="Incluir parámetros opcionales"
                />
              </Box>

              {optionalSettings && 
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "1.5rem"
                }}>

                  {/* Cantidad de lluvia */}
                  <CustomTextfield
                    id="maxRain"
                    value={formData.maxRain}
                    onChange={handleNumberInputChange}
                    label="Máxima cantidad de lluvia"
                    number={true}
                    endAdornment="mm"
                    placeholder="0 a 300"
                    disabled={!formData.rain}
                  />

                  {/* Preferencia de nieve */}
                  <CustomRadioButton
                    id="snow"
                    value={formData.snow}
                    onChange={handleInputChange}
                    label="¿Se puede realizar con nieve"
                  />

                  {/* Cantidad de nieve */}
                  <CustomTextfield
                    id="maxSnow"
                    value={formData.maxSnow}
                    onChange={handleNumberInputChange}
                    label="Máxima cantidad de nieve"
                    number={true}
                    endAdornment="mm"
                    placeholder="0 a 200"
                    disabled={!formData.snow}
                  />

                  <Box sx={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}>
                    {/* Humedad */}
                    <CustomTextfield
                      id="humidity"
                      value={formData.humidity}
                      onChange={handleNumberInputChange}
                      label="Máx. humedad"
                      number={true}
                      endAdornment="%"
                      placeholder="0 a 100"
                    />

                    {/* Índice UV */}
                    <CustomTextfield
                      id="uv_index"
                      value={formData.uv_index}
                      onChange={handleNumberInputChange}
                      label="Máx. índice UV"
                      number={true}
                      placeholder="0 a 40"
                    />

                    {/* Velocidad del viento */}
                    <CustomTextfield
                      id="wind_speed"
                      value={formData.wind_speed}
                      onChange={handleNumberInputChange}
                      label="Máx. velocidad del viento"
                      endAdornment="km/h"
                      number={true}
                      placeholder="0 a 400"
                    />

                    {/* Visibilidad */}
                    <CustomTextfield
                      id="visibility"
                      value={formData.visibility}
                      onChange={handleNumberInputChange}
                      label="Mín. visibilidad"
                      endAdornment="m"
                      number={true}
                      placeholder="0 a 10000"
                    />
                  </Box>
                </Box>
              }
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {formSubmitText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}