import { Activity } from "@/generated/prisma";
import { ActivityWithCategories } from "@/pages/api/activity/readByUser";

export type ActivityCreatePayload = Omit<Activity, "id" | "user_id" > & {
  categories_id: number[];
};

export type ActivityEditPayload = Omit<ActivityWithCategories, "user_id" | "ActivityCategory"> & {
  categories_id: number[];
};

export type ActivityCreateForm = Omit<Activity, "id" | "user_id" > & {
  categories_id: string[];
};

export const defaultNewActivity: ActivityCreateForm = {
  name: "",
  minTemp: 15,
  maxTemp: 24,
  rain: false,
  maxRain: null,
  maxSnow: null,
  snow: null,
  humidity: null,
  uv_index: null,
  wind_speed: null,
  visibility: null,
  categories_id: [],
}