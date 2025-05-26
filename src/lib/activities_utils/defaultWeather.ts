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
  },
  {
    name: "cloudy",
    icon: CloudIcon,
    minTemp: 0,
    maxTemp: 18,
    rain: false,
  },
  {
    name: "rainy",
    icon: WaterDropIcon,
    minTemp: 0,
    maxTemp: 18,
    rain: true,
  },
  {
    name: "snowy",
    icon: AcUnitIcon,
    minTemp: -20,
    maxTemp: 0,
    rain: true
  }

];