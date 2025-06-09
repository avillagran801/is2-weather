export function getHourLabel(time: string): string {
  const hour = time.split("T")[1];
  return hour;
}

export function getTimeLabel(time: string): string {
  const date = time.split("T")[0];
  const [year, month, day] = date.split("-");
  return `${day} ${new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short' })}`
}