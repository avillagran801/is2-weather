import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemIcon, ListItemText, SvgIconProps } from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import OpacityIcon from '@mui/icons-material/Opacity';
import SunnyIcon from '@mui/icons-material/Sunny';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';

type DetailsActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: ActivityWithCategories;
}

type ItemProps = {
  icon: React.ElementType<SvgIconProps>;
  title: string;
  value: string;
}

function Item({icon, title, value} : ItemProps) {
  const Icon = icon;
  
  return(
    <ListItem>
      <ListItemIcon> <Icon /> </ListItemIcon>
      <ListItemText
        sx={{ color: 'black' }}
        primary={
          <span style={{ fontWeight: 'bold', color: 'black' }}>
            {title}:
          </span>
        }
        secondary={
          <span style={{ color: 'black' }}>
            {value}
          </span>
        }
      />
    </ListItem>
  )
}

export default function DetailsActivityDialog({ open, setOpen, setOpenEditDialog, setOpenDeleteDialog, selectedActivity } : DetailsActivityDialogProps) {

  const handleEdit = () => {
    setOpen(false);
    setOpenEditDialog(true);
  }

  const handleDelete = () => {
    setOpen(false);
    setOpenDeleteDialog(true);
  }

  return(
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        fontWeight={'fontWeightBold'}
      >
        Detalles de la actividad
      </DialogTitle>
      <DialogContent>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
        }}>
          <Item
            icon={DirectionsRunIcon}
            title="Nombre"
            value={selectedActivity.name}
          />
          <Item
            icon={DeviceThermostatIcon}
            title="Temperatura"
            value={selectedActivity.minTemp + "°C - " + selectedActivity.maxTemp + "°C"}
          />
          <Item
            icon={WaterDropIcon}
            title="Lluvia"
            value={selectedActivity.rain? (selectedActivity.maxRain? selectedActivity.maxRain + "mm" : "Permitida") : "No aplica"}
          />
          <Item
            icon={AcUnitIcon}
            title="Nieve"
            value={selectedActivity.snow?(selectedActivity.maxSnow? selectedActivity.maxSnow + "mm" : "Permitida")  : "No aplica"}
          />
          <Item
            icon={OpacityIcon}
            title="Humedad"
            value={selectedActivity.humidity? selectedActivity.humidity + "%" : "No aplica"}
          />
          <Item
            icon={SunnyIcon}
            title="Índice UV"
            value={selectedActivity.uv_index? selectedActivity.uv_index + "" : "No aplica"}
          />
          <Item
            icon={AirIcon}
            title="Velocidad del viento"
            value={selectedActivity.wind_speed? selectedActivity.wind_speed + "km/h" : "No aplica"}
          />
          <Item
            icon={VisibilityIcon}
            title="Visibilidad"
            value={selectedActivity.visibility? selectedActivity.visibility + "m" : "No aplica"}
          />
        </Box>

        {/* Categorías */}
        <ListItem sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "0.8rem"
        }}>
          <ListItemText
            sx={{ color: 'black' }}
            primary={
              <span style={{ fontWeight: 'bold', color: 'black' }}>
                Categorías:
              </span>
            }
          />
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem"
          }}>
            {selectedActivity.ActivityCategory.map((category) => (
              <Chip
                key={category.Category.id}
                label={category.Category.name}
              />
            ))

            }
          </Box>
        </ListItem>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleEdit}
        >
          Editar
        </Button>
        <Button
          sx={{
            color: "#e31010",
          }}
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </DialogActions>

    </Dialog>
  );
}