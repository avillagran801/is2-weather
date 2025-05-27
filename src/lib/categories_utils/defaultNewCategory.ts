import { Category } from "@/generated/prisma";

export type CategoryCreatePayload = Omit<Category, "id" | "user_id" > & {
  activities_id: number[];
}

export type CategoryCreateForm = Omit<Category, "id" | "user_id" > & {
  activities_id: string[];
}

export const defaultNewCategory: CategoryCreateForm = {
  name: "",
  activities_id: []
}