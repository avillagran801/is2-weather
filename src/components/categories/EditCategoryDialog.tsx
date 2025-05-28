import React from "react";
import BaseCategoryForm from "./BaseCategoryForm";
import { Activity } from "@/generated/prisma";
import { CategoryEditPayload, defaultNewCategory } from "@/lib/categories_utils/defaultNewCategory";
import { CategoryWithActivities } from "@/pages/api/category/readWithActivitiesByUser";

type EditCategoryDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategory: CategoryWithActivities;
  onSubmit: (category: CategoryEditPayload) => void;
  userActivities: Activity[]; // REVISAR
}

export default function EditCategoryDialog({ open, setOpen, selectedCategory, onSubmit, userActivities } : EditCategoryDialogProps) {
  const [formData, setFormData] = React.useState(defaultNewCategory);

  React.useEffect(() => {
    if(open) {
      setFormData({
        ...selectedCategory,
        activities_id: selectedCategory.ActivityCategory.map((item => item.Activity.id.toString()))
      })
    }
  }, [selectedCategory, open]);

  const handleClose = () => {
    setOpen(false);
    setFormData(defaultNewCategory);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      id: selectedCategory.id,
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
      formTitle="Editar categoría"
      formSubmitText="Editar"
      formData={formData}
      setFormData={setFormData}
      userActivities={userActivities}
    />
  );
}