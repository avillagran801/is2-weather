import React from "react";
import BaseCategoryForm from "./BaseCategoryForm";
import { CategoryCreatePayload, defaultNewCategory } from "@/lib/categories_utils/defaultNewCategory";
import { Activity } from "@/generated/prisma";

type CreateCategoryDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (category: CategoryCreatePayload) => void;
  userActivities: Activity[]; // REVISAR
}

export default function CreateCategoryDialog({ open, setOpen, onSubmit, userActivities } : CreateCategoryDialogProps) {
  const [formData, setFormData] = React.useState(defaultNewCategory);

  const handleClose = () => {
    setOpen(false);
    setFormData(defaultNewCategory);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: formData.name,
      activities_id: formData.activities_id.map(Number)
    });

    handleClose();
  }

  return(
    <BaseCategoryForm
      open={open}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      formTitle="Crear nueva categoría"
      formSubmitText="Crear"
      formData={formData}
      setFormData={setFormData}
      userActivities={userActivities}
    />
  );
}