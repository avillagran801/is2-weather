import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import { PlainCategory } from "@/pages/api/category/readByUser";
import React from "react";
import BaseActivityForm from "./BaseActivityForm";
import { ActivityEditPayload, defaultNewActivity } from "@/lib/activities_utils/defaultNewActivity";

type EditActivityDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedActivity: ActivityWithCategories;
  onSubmit: (activity: ActivityEditPayload) => void;
  userCategories: PlainCategory[];
}

export default function EditActivityDialog({open, setOpen, selectedActivity, onSubmit, userCategories}: EditActivityDialogProps) {
  const [formData, setFormData] = React.useState(defaultNewActivity);
  const [optionalSettings, setOptionalSettings] = React.useState(false);

  // Se resetea la información del form cada vez que se abre el dialog
  React.useEffect(() => {
    if(open) {
      setFormData({
        ...selectedActivity,
        categories_id: selectedActivity.ActivityCategory.map((item => item.Category.id.toString()))
      });

      // Abre ajustes adicionales dependiendo de si ya existían o no 
      setOptionalSettings(
        selectedActivity.maxRain != null ||
        selectedActivity.snow != null ||
        selectedActivity.maxSnow != null ||
        selectedActivity.humidity != null ||
        selectedActivity.uv_index != null ||
        selectedActivity.wind_speed != null ||
        selectedActivity.visibility != null
      );
    }
  }, [selectedActivity, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      id: selectedActivity.id,
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

  return(
    <>
      <BaseActivityForm
        formTitle="Editar actividad"
        formSubmitText="Editar"
        formData={formData}
        setFormData={setFormData}
        optionalSettings={optionalSettings}
        setOptionalSettings={setOptionalSettings}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        userCategories={userCategories}
      />
    </>
  );
}