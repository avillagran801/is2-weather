import { CategoryWithActivities } from "@/pages/api/category/readWithActivitiesByUser";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type DeleteCategoryDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: CategoryWithActivities;
  onSubmit: (categoryId: number) => void;
}


export default function DeleteCategoryDialog({ open, setOpen, selectedCategory, onSubmit} : DeleteCategoryDialogProps) {
  const handleClose = () => {
    setOpen(false);
  }

  const handleSubmit = () => {
    onSubmit(selectedCategory.id)
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
        Eliminar categoría
      </DialogTitle>
      <DialogContent>
        ¿Está seguro/a de que desea eliminar esta categoría? Una vez eliminada no es posible recuperarla.
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