import { ActivityWithCategories } from "@/pages/api/activity/readByUser";

export type ScoredActivity = ActivityWithCategories & {
    score: number;
    maxScore: number;
};

// CHANGE LATER (!!!)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateActivityScores(activities: ActivityWithCategories[], weather: any): ScoredActivity[] {

  const scoredActivities = activities.map(activity => {
    let score = 0;
    let maxScore = 4; // + 1 for each optional condition that is defined

    // Check temperature (2 points)
    if (weather.current.temperature_2m >= activity.minTemp &&
            weather.current.temperature_2m <= activity.maxTemp) {
      score += 2;
    }

    // Check rain condition (2 point)
    const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weather.current.weather_code);
    if (!isRaining || (isRaining && activity.rain)) {
      score += 2;
    }

    // Rain amount check (1 point)
    if (activity.maxRain !== null) {
      maxScore += 1;
      if (activity.maxRain >= weather.current.rain) {
        score += 1;
      }
    }

    // Check humidity
    if (activity.humidity !== null) {
      maxScore += 1;
      if (activity.humidity >= weather.current.relative_humidity_2m) {
        score += 1;
      }
    }

    // Check UV index
    if (activity.uv_index !== null) {
      maxScore += 1;
      if (activity.uv_index >= weather.current.uv_index) {
        score += 1;
      }
    }

    // Snow presence check (1 point)
    const isSnowing = [71, 73, 75, 77, 85, 86].includes(weather?.weather_code);
    if (activity.snow !== null) {
      maxScore += 1;
      if (!isSnowing || (isSnowing && activity.snow)) {
        score += 1;
      }
    }

    // Snow amount check (1 point)
    if (activity.maxSnow !== null) {
      maxScore += 1;
      if (activity.maxSnow >= weather.current.snowfall) {
        score += 1;
      }
    }

    // Check wind speed
    if (activity.wind_speed !== null) {
      maxScore += 1;
      if (activity.wind_speed >= weather.current.wind_speed_10m) {
        score += 1;
      }
    }

    // Check visibility
    if (activity.visibility !== null) {
      maxScore += 1;
      if (activity.visibility <= weather.current.visibility) {
        score += 1;
      }
    }


    return { ...activity, score, maxScore };
  });

  return scoredActivities;


};