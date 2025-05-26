import React from 'react';
import Dialog from '@mui/material/Dialog';
import { PlainCategory } from '@/pages/api/category/readByUser';
import { ActivityCreatePayload, defaultNewActivity } from '@/lib/activities_utils/defaultNewActivity';
import BaseActivityForm from './BaseActivityForm';

type CreateActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (activity: ActivityCreatePayload) => void;
  userCategories: PlainCategory[];
}


export default function CreateActivityDialog({open, setOpen, onSubmit, userCategories}: CreateActivityDialogProps) {
  const [formData, setFormData] = React.useState(defaultNewActivity);
  const [optionalSettings, setOptionalSettings] = React.useState(false);

  const handleClose = () => {
    setOpen(false);

    // Limpia valores cada vez que se cierra
    setFormData(defaultNewActivity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      minTemp: formData.minTemp,
      maxTemp: formData.maxTemp,
      rain: formData.rain,
      maxRain: optionalSettings? formData.maxRain : null,
      snow: optionalSettings? formData.snow : null,
      maxSnow: optionalSettings? formData.maxSnow : null,
      humidity:optionalSettings? formData.humidity : null,
      uv_index: optionalSettings? formData.uv_index : null,
      wind_speed: optionalSettings? formData.wind_speed : null,
      visibility: optionalSettings? formData.visibility : null,
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
        <BaseActivityForm
          formTitle="Crear nueva actividad"
          formSubmitText="Crear"
          formData={formData}
          setFormData={setFormData}
          optionalSettings={optionalSettings}
          setOptionalSettings={setOptionalSettings}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          userCategories={userCategories}
        />
      </Dialog>
    </>
  );
}
