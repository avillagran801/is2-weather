import { Activity } from "@/generated/prisma";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { SvgIconProps } from "@mui/material";

export type WeatherOption = Omit<Activity, "id" | "name"| "user_id" > & {
  name: string;
  icon: React.ElementType<SvgIconProps>;
};

export type PlainWeatherOption = Omit<Activity, "id" | "name"| "user_id" >;

export const defaultWeatherOptions: WeatherOption[] = [
  {
    name: "sunny",
    icon: WbSunnyIcon,
    minTemp: 18,
    maxTemp: 24,
    rain: false,
    maxRain: null,
    maxSnow: null,
    snow: null,
    humidity: 50,
    uv_index: 12,
    wind_speed: 5,
    visibility: 5000,
  },
  {
    name: "cloudy",
    icon: CloudIcon,
    minTemp: 0,
    maxTemp: 18,
    rain: false,
    maxRain: null,
    snow: false,
    maxSnow: null,
    humidity: 70,
    uv_index: 2,
    wind_speed: 10, 
    visibility: 8000 
  },
  {
    name: "rainy",
    icon: WaterDropIcon,
    minTemp: 0,
    maxTemp: 18,
    rain: true,
    maxRain: 50,        
    snow: false,
    maxSnow: null,
    humidity: 90,
    uv_index: 1,
    wind_speed: 15,      
    visibility: 4000
  },
  {
    name: "snowy",
    icon: AcUnitIcon,
    minTemp: -20,
    maxTemp: 0,
    rain: true,
    maxRain: null,
    snow: true,
    maxSnow: 30,         
    humidity: 80,
    uv_index: 1,
    wind_speed: 20,      
    visibility: 3000 
  }
];