export const temperatureMinDistance = 1;

export const temperatureMarks = Array.from({ length: 8 }, (_, i) => ({
  value: -30 + i * 10,
  label: `${-30 + i * 10}°C`,
}));