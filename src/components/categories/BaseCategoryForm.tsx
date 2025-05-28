import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import CustomTextfield from "../form/CustomTextfield";
import { CategoryCreateForm } from "@/lib/categories_utils/defaultNewCategory";
import { Activity } from "@/generated/prisma";

type BaseCategoryFormProps = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  formTitle: string;
  formSubmitText: string;
  formData: CategoryCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<CategoryCreateForm>>;
  userActivities: Activity[];
}

export default function BaseCategoryForm({
  open,
  handleClose,
  handleSubmit,
  formTitle,
  formSubmitText,
  formData,
  setFormData,
  userActivities
}: BaseCategoryFormProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleActivitiesChange = (event: React.SyntheticEvent, value: Activity[]) => {
    setFormData({
      ...formData,
      activities_id: value.map(activity => activity.id.toString())
    });
  };

  // Muestra las actividades seleccionadas en base al id dentro del formData
  const selectedActivities = userActivities.filter(activity => 
    formData.activities_id.includes(activity.id.toString())
  );

  return(
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle fontWeight={'fontWeightBold'}>
        {formTitle}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1rem"
        }}>
          <Typography gutterBottom={true} variant="body1">
            Por favor rellene los campos a continuación.              
          </Typography>

          <CustomTextfield
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Nombre"
            placeholder="Salir a correr"
            required
          />
          
          <Autocomplete
            multiple
            options={userActivities}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            value={selectedActivities}
            onChange={handleActivitiesChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Seleccione actividades" />
            )}
          />
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
  );
}