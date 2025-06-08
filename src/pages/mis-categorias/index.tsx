import React from "react";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/layout/Loading";
// import GenericActivityCard from "@/components/activities/GenericActivityCard";
import { ActivityWithCategories } from "../api/activity/readByUser";
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog";
import { CategoryCreatePayload, CategoryEditPayload } from "@/lib/categories_utils/defaultNewCategory";
import { CategoryWithActivities } from "../api/category/readWithActivitiesByUser";
import SearchAndCreateBar from "@/components/layout/SearchAndCreateBar";
import CategoryAccordion from "@/components/categories/CategoryAccordion";
import { defaultCategory } from "@/lib/categories_utils/defaultCategory";
import EditCategoryDialog from "@/components/categories/EditCategoryDialog";
import DeleteCategoryDialog from "@/components/categories/DeleteCategoryDialog";

export default function Categorias() {
  const [categories, setCategories] = React.useState<CategoryWithActivities[]>([]);
  const [activities, setActivities] = React.useState<ActivityWithCategories[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [refreshCategories, setRefreshCategories] = React.useState(false);

  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState(defaultCategory);

  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // CHANGE USER_ID LATER
        const [catResponse, actResponse] = await Promise.all([
          fetch("/api/category/readWithActivitiesByUser?user_id=2"), // <--- CHANGE THIS
          fetch("/api/activity/readByUser?user_id=2") // <--- CHANGE THIS
        ]);

        const [catData, actData] = await Promise.all([
          catResponse.json(),
          actResponse.json()
        ]);

        if (!catResponse.ok) throw new Error(catData.message);
        if (!actResponse.ok) throw new Error(actData.message);

        setCategories(catData);
        setActivities(actData);
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos");
      } finally {
        setRefreshCategories(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCategories]);

  const handleAddCategory = async (newCategory: CategoryCreatePayload) => {
    try {
      if (!newCategory.name) {
        throw new Error("La categoría necesita un nombre");
      }

      // CHANGE USER_ID LATER
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCategory,
          user_id: 2, // <--- CHANGE THIS 
          activities_id: newCategory.activities_id,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");
      }

      setRefreshCategories(true);
      setLoading(true);
    }
    catch (error) {
      console.log(error);
      alert("Error al crear la categoría")
    }
  }

  const handleEditCategory = async (editedCategory: CategoryEditPayload) => {
    try{
      if(!editedCategory.name) {
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      // CHANGE USER_ID LATER
      const response = await fetch("/api/category/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedCategory,
          activities_id: editedCategory.activities_id,
        })
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");          
      }
  
      setRefreshCategories(true);
      setLoading(true);      
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error){
        alert(error.message);
      }
    }
  };

  const handleDeleteCategory = async (deletedCategoryId: number) => {
    try {
      const response = await fetch("/api/category/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deletedCategoryId,
        })
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Solicitud fallida");  
      }

      setRefreshCategories(true);
      setLoading(true);
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error){
        alert(error.message);
      }
    }
  };

  // TERMINAR DE IMPLEMENTAR
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);
  };


  if(loading) {
    return(
      <Loading />
    )
  }

  console.log("refreshCategories" , refreshCategories)
  console.log("loading", loading)

  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        margin: "1.4rem",
        gap: "1rem"
      }}>
        <Typography variant="h5">
          Mis categorías
        </Typography>
        <SearchAndCreateBar
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          buttonText="Crear categoría"
          onButtonClick={() => {setOpenCreateDialog(true)}}
        />
        {categories.map((category, index) => (
          <CategoryAccordion
            key={category.id}
            category={category}
            defaultExpanded={index == 0}
            onEditClick={() => {setSelectedCategory(category); setOpenEditDialog(true); }}
            onDeleteClick={() => {setSelectedCategory(category); setOpenDeleteDialog(true);}}
          />
        ))}
      </Box>
      <CreateCategoryDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSubmit={handleAddCategory}
        userActivities={activities}
      />
      <EditCategoryDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        selectedCategory={selectedCategory}
        onSubmit={handleEditCategory}
        userActivities={activities}
      />
      <DeleteCategoryDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        selectedCategory={selectedCategory}
        onSubmit={handleDeleteCategory}
      />
    </>
  );
}