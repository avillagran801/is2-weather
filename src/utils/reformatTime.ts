export function getHourLabel(time: string): string {
    const [date, hour] = time.split("T");
    return hour;
}

export function getTimeLabel(time: string): string {
    const [date, hour] = time.split("T");
    const [year, month, day] = date.split("-");
    return `${day} ${new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short' })}`
}