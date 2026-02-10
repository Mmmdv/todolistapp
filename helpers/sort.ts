import { Todo } from "@/types/todo"

export type SortBy = "date" | "text"
export type SortOrder = "asc" | "desc"

/**
 * Generic sort function for todos.
 * @param todoList - The list to sort
 * @param sortBy - Sort by "date" or "text"
 * @param sortOrder - Sort "asc" or "desc"
 * @param dateKey - Which date field to sort by (defaults to "createdAt")
 */
export const sortTodos = (
    todoList: Todo[],
    sortBy: SortBy,
    sortOrder: SortOrder,
    dateKey: keyof Pick<Todo, "createdAt" | "completedAt" | "updatedAt" | "archivedAt"> = "createdAt"
): Todo[] => {
    return [...todoList].sort((a, b) => {
        if (sortBy === "date") {
            const dateA = new Date(a[dateKey] || a.createdAt).getTime()
            const dateB = new Date(b[dateKey] || b.createdAt).getTime()
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        } else {
            const textA = a.title.toLowerCase()
            const textB = b.title.toLowerCase()
            return sortOrder === "asc"
                ? textA.localeCompare(textB)
                : textB.localeCompare(textA)
        }
    })
}
