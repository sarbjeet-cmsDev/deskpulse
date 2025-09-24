export default function formatMinutes(min: string | number | null | undefined): string {
    const totalMinutes = Number(min);
    if (isNaN(totalMinutes) || totalMinutes < 0) {
        return "0h";
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
}


export const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};