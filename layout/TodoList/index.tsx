import StyledText from "@/components/StyledText"
import { toggleAnimation } from "@/constants/animations"
import { COLORS } from "@/constants/ui"
import { sortTodos } from "@/helpers/sort"
import { Todo } from "@/types/todo"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef, useState } from "react"
import { LayoutAnimation, ScrollView, TouchableOpacity, View } from "react-native"
import ArchiveAllModal from "../Modals/ArchiveAllModal.tsx"
import ClearArchiveModal from "../Modals/ClearArchiveModal.tsx"
import TodoItem from "../TodoItem"
import SortControls, { SortBy, SortOrder } from "./SortControls"
import { styles } from "./styles"

type TodoListProps = {
    todos: Todo[]
    onDeleteTodo: (id: Todo["id"]) => void
    onCheckTodo: (id: Todo["id"]) => void
    onEditTodo: (id: Todo["id"], title: Todo["title"]) => void
    onArchiveTodo: (id: Todo["id"]) => void
    onArchiveAll?: () => void
    onClearArchive: () => void
    archivedTodos: Todo[]
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDeleteTodo, onCheckTodo, onEditTodo, onArchiveTodo, onClearArchive, archivedTodos, onArchiveAll }) => {
    const [todoSortBy, setTodoSortBy] = useState<SortBy>("date")
    const [todoSortOrder, setTodoSortOrder] = useState<SortOrder>("desc")
    const [doneSortBy, setDoneSortBy] = useState<SortBy>("date")
    const [doneSortOrder, setDoneSortOrder] = useState<SortOrder>("desc")
    const [archiveSortBy, setArchiveSortBy] = useState<SortBy>("date")
    const [archiveSortOrder, setArchiveSortOrder] = useState<SortOrder>("desc")

    const [todoExpanded, setTodoExpanded] = useState(true)
    const [doneExpanded, setDoneExpanded] = useState(true)
    const [archiveExpanded, setArchiveExpanded] = useState(false)
    const [isClearArchiveModalOpen, setIsClearArchiveModalOpen] = useState(false)
    const [isArchiveAllModalOpen, setIsArchiveAllModalOpen] = useState(false)

    const pendingTodos = todos.filter(todo => !todo.isCompleted && !todo.isArchived)
    const completedTodos = todos.filter(todo => todo.isCompleted && !todo.isArchived)

    const prevPendingCount = useRef(pendingTodos.length)
    const prevCompletedCount = useRef(completedTodos.length)

    useEffect(() => {
        if (pendingTodos.length > prevPendingCount.current) setTodoExpanded(true)
        prevPendingCount.current = pendingTodos.length
    }, [pendingTodos.length])

    useEffect(() => {
        if (completedTodos.length > prevCompletedCount.current) setDoneExpanded(true)
        prevCompletedCount.current = completedTodos.length
    }, [completedTodos.length])

    const sortedPendingTodos = sortTodos(pendingTodos, todoSortBy, todoSortOrder, "createdAt")
    const sortedCompletedTodos = sortTodos(completedTodos, doneSortBy, doneSortOrder, "completedAt")
    const sortedArchivedTodos = sortTodos(archivedTodos, archiveSortBy, archiveSortOrder, "archivedAt")

    const toggleSection = (setter: (fn: (prev: boolean) => boolean) => void) => {
        LayoutAnimation.configureNext(toggleAnimation);
        setter(prev => !prev);
    }

    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <StyledText style={styles.emptyText}>No tasks yet</StyledText>
                <StyledText style={styles.emptySubtext}>Add a new task to get started</StyledText>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {/* To Do Section */}
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={[styles.sectionHeader, sortedPendingTodos.length === 0 && { opacity: 0.5 }]}
                    onPress={() => toggleSection(setTodoExpanded)}
                    disabled={sortedPendingTodos.length === 0}
                >
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="list-circle" size={24} color="#5BC0EB" />
                        <StyledText style={styles.sectionTitle}>
                            To Do ({sortedPendingTodos.length})
                        </StyledText>
                    </View>
                    <View style={styles.sectionControls}>
                        {todoExpanded && sortedPendingTodos.length > 0 && (
                            <SortControls
                                sortBy={todoSortBy}
                                sortOrder={todoSortOrder}
                                onToggleSortBy={() => setTodoSortBy(prev => prev === "date" ? "text" : "date")}
                                onToggleSortOrder={() => setTodoSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                            />
                        )}
                        <Ionicons
                            name={todoExpanded && sortedPendingTodos.length > 0 ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={COLORS.PRIMARY_TEXT}
                        />
                    </View>
                </TouchableOpacity>
                {todoExpanded && sortedPendingTodos.map(item => (
                    <TodoItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        isCompleted={item.isCompleted}
                        createdAt={item.createdAt}
                        completedAt={item.completedAt}
                        updatedAt={item.updatedAt}
                        deleteTodo={onDeleteTodo}
                        checkTodo={onCheckTodo}
                        editTodo={onEditTodo}
                    />
                ))}
            </View>

            <View style={styles.sectionDivider} />

            {/* Done Section */}
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={[styles.sectionHeader, sortedCompletedTodos.length === 0 && { opacity: 0.5 }]}
                    onPress={() => toggleSection(setDoneExpanded)}
                    disabled={sortedCompletedTodos.length === 0}
                >
                    <View style={styles.sectionTitleContainer}>
                        <Ionicons name="checkmark-done-circle" size={24} color="#4ECDC4" />
                        <StyledText style={styles.sectionTitle}>Done ({sortedCompletedTodos.length})</StyledText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {sortedCompletedTodos.length > 0 && onArchiveAll && (
                            <TouchableOpacity onPress={() => setIsArchiveAllModalOpen(true)} style={{ padding: 4 }}>
                                <Ionicons name="archive-outline" size={20} color={COLORS.PRIMARY_TEXT} />
                            </TouchableOpacity>
                        )}
                        <Ionicons
                            name={doneExpanded ? "chevron-down" : "chevron-forward"}
                            size={20}
                            color={COLORS.PRIMARY_TEXT}
                        />
                    </View>
                </TouchableOpacity>

                {doneExpanded && sortedCompletedTodos.map(item => (
                    <TodoItem
                        key={item.id}
                        {...item}
                        deleteTodo={onDeleteTodo}
                        checkTodo={onCheckTodo}
                        editTodo={onEditTodo}
                        archiveTodo={onArchiveTodo}
                    />
                ))}

                <View style={styles.sectionDivider} />

                {/* Archive Section */}
                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={[styles.sectionHeader, sortedArchivedTodos.length === 0 && { opacity: 0.5 }]}
                        onPress={() => toggleSection(setArchiveExpanded)}
                        activeOpacity={0.7}
                        disabled={sortedArchivedTodos.length === 0}
                    >
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="archive" size={24} color="#888" />
                            <StyledText style={styles.sectionTitle}>
                                Archive ({archivedTodos.length})
                            </StyledText>
                        </View>
                        <View style={styles.sectionControls}>
                            {archivedTodos.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setIsClearArchiveModalOpen(true)}
                                    style={{ marginRight: 10 }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                                </TouchableOpacity>
                            )}
                            {archiveExpanded && sortedArchivedTodos.length > 0 && (
                                <SortControls
                                    sortBy={archiveSortBy}
                                    sortOrder={archiveSortOrder}
                                    onToggleSortBy={() => setArchiveSortBy(archiveSortBy === "date" ? "text" : "date")}
                                    onToggleSortOrder={() => setArchiveSortOrder(archiveSortOrder === "asc" ? "desc" : "asc")}
                                />
                            )}
                            <Ionicons
                                name={archiveExpanded && sortedArchivedTodos.length > 0 ? "chevron-up" : "chevron-down"}
                                size={20}
                                color={COLORS.PRIMARY_TEXT}
                            />
                        </View>
                    </TouchableOpacity>
                    {archiveExpanded && sortedArchivedTodos.map(item => (
                        <TodoItem
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            isCompleted={item.isCompleted}
                            isArchived={item.isArchived}
                            createdAt={item.createdAt}
                            completedAt={item.completedAt}
                            updatedAt={item.updatedAt}
                            archivedAt={item.archivedAt}
                            deleteTodo={onDeleteTodo}
                            checkTodo={onCheckTodo}
                            editTodo={onEditTodo}
                            archiveTodo={onArchiveTodo}
                        />
                    ))}
                </View>
            </View>

            {onArchiveAll && (
                <ArchiveAllModal
                    isOpen={isArchiveAllModalOpen}
                    onClose={() => setIsArchiveAllModalOpen(false)}
                    onArchiveAll={onArchiveAll}
                />
            )}

            <ClearArchiveModal
                isOpen={isClearArchiveModalOpen}
                onClose={() => setIsClearArchiveModalOpen(false)}
                onClear={onClearArchive}
            />
        </ScrollView>
    )
}

export default TodoList