import { ActivityWithCategories } from "@/pages/api/activity/readByUser";
import { WeatherData } from "@/pages/api/weather/consult";

export type conditionsPassed = {
    temperature: boolean;
    rain: boolean;
    maxRain: boolean | null;
    humidity: boolean | null;
    uv_index: boolean | null;
    snow: boolean | null;
    maxSnow: boolean | null;
    wind_speed: boolean | null;
    visibility: boolean | null;
};

export function getPassedConditions(activity: ActivityWithCategories, weather: WeatherData): conditionsPassed {

    let conditions: conditionsPassed = {
        temperature: false,
        rain: false,
        maxRain: null,
        humidity: null,
        uv_index: null,
        snow: null,
        maxSnow: null,
        wind_speed: null,
        visibility: null,
    };

    // Check temperature (2 points)
    if (weather.current.temperature_2m >= activity.minTemp &&
        weather.current.temperature_2m <= activity.maxTemp) {
        conditions.temperature = true;
    }

    // Check rain condition (2 point)
    const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weather.current.weather_code);
    if (!isRaining || (isRaining && activity.rain)) {
        conditions.rain = true;
    }

    // Rain amount check (1 point)
    if (activity.maxRain !== null) {
        conditions.maxRain = false;
        if (activity.maxRain >= weather.current.rain) {
            conditions.maxRain = true;
        }
    }

    // Check humidity
    if (activity.humidity !== null) {
        conditions.humidity = false;
        if (activity.humidity >= weather.current.relative_humidity_2m) {
            conditions.humidity = true;
        }
    }

    // Check UV index
    if (activity.uv_index !== null) {
        conditions.uv_index = false;
        if (activity.uv_index >= weather.current.uv_index) {
            conditions.uv_index = true;
        }
    }

    // Snow presence check (1 point)
    const isSnowing = [71, 73, 75, 77, 85, 86].includes(weather.current.weather_code);
    if (activity.snow !== null) {
        conditions.snow = false;
        if (!isSnowing || (isSnowing && activity.snow)) {
            conditions.snow = true;
        }
    }

    // Snow amount check (1 point)
    if (activity.maxSnow !== null) {
        conditions.maxSnow = false;
        if (activity.maxSnow >= weather.current.snowfall) {
            conditions.maxSnow = true;
        }
    }

    // Check wind speed
    if (activity.wind_speed !== null) {
        conditions.wind_speed = false;
        if (activity.wind_speed >= weather.current.wind_speed_10m) {
            conditions.wind_speed = true;
        }
    }

    // Check visibility
    if (activity.visibility !== null) {
        conditions.visibility = false;
        if (activity.visibility <= weather.current.visibility) {
            conditions.visibility = true;
        }
    }


    return conditions;
};