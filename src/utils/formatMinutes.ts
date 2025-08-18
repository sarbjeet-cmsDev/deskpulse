export default function formatMinutes(min: string | number | null | undefined): string {
    const totalMinutes = Number(min);
    if (isNaN(totalMinutes) || totalMinutes < 0) {
        return "0h";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
}
