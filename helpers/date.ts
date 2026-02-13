export const getFullFormatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date)
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeStr = date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
    return `${dateStr} ${timeStr}`
}

export const formatDuration = (start: string, end: string, t: any) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffMs = endTime - startTime;

    if (diffMs <= 0) return "0 " + t("minutes_short");

    const diffMins = Math.ceil(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays} ${t("days_short")} ${diffHours % 24} ${t("hours_short")}`;
    }
    if (diffHours > 0) {
        return `${diffHours} ${t("hours_short")} ${diffMins % 60} ${t("minutes_short")}`;
    }
    return `${diffMins} ${t("minutes_short")}`;
};
