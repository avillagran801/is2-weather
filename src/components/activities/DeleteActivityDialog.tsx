import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type DeleteActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (activityId: number) => void;
  selectedActivity: ActivityWithCategories;
}

export default function DeleteActivityDialog({ open, setOpen, onSubmit, selectedActivity } : DeleteActivityDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onSubmit(selectedActivity.id)
    handleClose();
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
        Eliminar actividad
      </DialogTitle>
      <DialogContent>
        ¿Está seguro/a de que desea eliminar esta actividad? Una vez eliminada no es posible recuperarla.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          sx={{
            color: "#e31010",
          }}
          onClick={handleSubmit}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}