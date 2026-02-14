import { useAppDispatch, useAppSelector } from "@/store";
import { updateNotificationStatus } from "@/store/slices/notificationSlice";
import { addTodo, archiveAllTodos, archiveTodo, checkTodo, clearArchive, deleteTodo, editTodo, selectTodos } from "@/store/slices/todoSlice";
import { Todo } from "@/types/todo";
import * as Notifications from 'expo-notifications';

// Random ID generator 
const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const useTodo = () => {
    const todos = useAppSelector(selectTodos);
    const dispatch = useAppDispatch();

    const notifications = useAppSelector(state => state.notification.notifications);

    const onAddTodo = (title: Todo["title"], reminder?: string, notificationId?: string) => {
        dispatch(addTodo({
            id: generateId(),
            title,
            isCompleted: false,
            createdAt: new Date().toISOString(),
            reminder,
            notificationId
        }))
    }

    const onDeleteTodo = async (id: Todo["id"]) => {
        const todo = todos.find(t => t.id === id);
        if (todo && todo.notificationId) {
            const notification = notifications.find(n => n.id === todo.notificationId);
            if (notification && notification.status === 'Gözlənilir') {
                try {
                    await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
                } catch (error) {
                    // silently ignore
                }
                dispatch(updateNotificationStatus({ id: todo.notificationId, status: 'Ləğv olunub' }));
            }
        }
        dispatch(deleteTodo(id))
    }

    const onEditTodo = (id: Todo["id"], title: Todo["title"], reminder?: string, notificationId?: string) => {
        dispatch(editTodo({ id, title, reminder, notificationId }))
    }

    const onCheckTodo = async (id: Todo["id"]) => {
        const todo = todos.find(t => t.id === id);
        if (todo && !todo.isCompleted && todo.notificationId) {
            const notification = notifications.find(n => n.id === todo.notificationId);
            if (notification && notification.status === 'Gözlənilir') {
                try {
                    await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
                } catch (error) {
                    // silently ignore
                }
                // Instead of deleting, mark as cancelled so it stays in history as 'Ləğv olunub'
                dispatch(updateNotificationStatus({ id: todo.notificationId, status: 'Ləğv olunub' }));
            }
            // If notification is 'Göndərilib', we do nothing, it stays in history as 'Göndərilib'
        }
        dispatch(checkTodo(id))
    }

    const onArchiveTodo = async (id: Todo["id"]) => {
        const todo = todos.find(t => t.id === id);
        if (todo && todo.notificationId) {
            const notification = notifications.find(n => n.id === todo.notificationId);
            if (notification && notification.status === 'Gözlənilir') {
                try {
                    await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
                } catch (error) {
                    // silently ignore
                }
                dispatch(updateNotificationStatus({ id: todo.notificationId, status: 'Ləğv olunub' }));
            }
        }
        dispatch(archiveTodo(id))
    }

    const onArchiveAll = () => {
        dispatch(archiveAllTodos())
    }


    const onClearArchive = async () => {
        const archivedTodos = todos.filter(t => t.isArchived);
        for (const todo of archivedTodos) {
            if (todo.notificationId) {
                const notification = notifications.find(n => n.id === todo.notificationId);
                if (notification && notification.status === 'Gözlənilir') {
                    try {
                        await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
                    } catch (error) {
                        // silently ignore
                    }
                    dispatch(updateNotificationStatus({ id: todo.notificationId, status: 'Ləğv olunub' }));
                }
            }
        }
        dispatch(clearArchive())
    }

    const completedTodos = todos.filter((todo) => todo.isCompleted && !todo.isArchived);
    const archivedTodos = todos.filter((todo) => todo.isArchived);

    return {
        onAddTodo,
        onDeleteTodo,
        onEditTodo,
        onCheckTodo,
        onArchiveTodo,
        onArchiveAll,
        onClearArchive,
        todos,
        completedTodos,
        archivedTodos
    };
}

export default useTodo;
