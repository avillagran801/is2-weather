import { Category } from "@/generated/prisma";
import { CategoryWithActivities } from "@/pages/api/category/readWithActivitiesByUser";

export type CategoryCreatePayload = Omit<Category, "id" | "user_id" > & {
  activities_id: number[];
}

export type CategoryEditPayload = Omit<CategoryWithActivities, "user_id" | "ActivityCategory"> & {
  activities_id: number[];
}

export type CategoryCreateForm = Omit<Category, "id" | "user_id" > & {
  activities_id: string[];
}

export const defaultNewCategory: CategoryCreateForm = {
  name: "",
  activities_id: []
}