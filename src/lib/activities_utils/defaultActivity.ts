import { ActivityWithCategories } from "@/pages/api/activity/readByUser";

export const defaultActivity: ActivityWithCategories = {
  id: 0,
  user_id: 0,
  name: "",
  minTemp: 0,
  maxTemp: 0,
  rain: false,
  maxRain: null,
  maxSnow: null,
  snow: null,
  humidity: null,
  uv_index: null,
  wind_speed: null,
  visibility: null,
  ActivityCategory: [],  
}