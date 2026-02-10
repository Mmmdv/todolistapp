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
