import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import TodayTasksModal from '@/layout/Modals/TodayTasksModal';
import { selectTodos } from '@/store/slices/todoSlice';
import { Todo } from '@/types/todo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import StyledText from '../StyledText';

export default function ImportantTasksToday() {
    const { colors, t } = useTheme();
    const todos = useSelector(selectTodos);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter tasks with reminder set for today
    const todayTasks = useMemo(() => {
        return todos.filter((todo: Todo) => {
            if (!todo.reminder || todo.isCompleted || todo.isArchived) {
                return false;
            }
            const reminderDate = todo.reminder.split('T')[0];
            return reminderDate === today;
        });
    }, [todos, today]);

    const handleTaskPress = () => {
        // Navigate to todo tab
        router.push('/(tabs)/todo');
    };

    const handleViewAll = () => {
        setIsModalOpen(true);
    };

    const getTimeFromReminder = (reminder: string) => {
        const date = new Date(reminder);
        return date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
    };

    const getPriorityColor = (task: Todo, index: number) => {
        // Detection for overdue in the main card
        const isOverdue = task.reminder ? new Date(task.reminder) < new Date() : false;
        if (isOverdue) return '#f75d76ff'; // Use the same premium rose red

        const palette = [
            '#14B8A6', // Teal
            '#3B82F6', // Blue
            '#6366F1', // Indigo
            '#8B5CF6', // Purple
        ];
        return palette[index % palette.length];
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16, minHeight: 140 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, zIndex: 10 }}>
                <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
                    <Ionicons name="notifications-outline" size={20} color="#FFF" />
                </View>
                <StyledText
                    style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT, fontSize: 16, flex: 1, marginBottom: 0 }]}
                >
                    Bugünə nə var?
                </StyledText>
                {todayTasks.length > 0 && (
                    <View style={[styles.badge, { backgroundColor: '#3B82F6' }]}>
                        <StyledText style={styles.badgeText}>{todayTasks.length}</StyledText>
                    </View>
                )}
            </View>

            {todayTasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: colors.PRIMARY_BORDER }]}>
                        <Ionicons name="checkmark-done-circle-outline" size={40} color={colors.PLACEHOLDER} />
                    </View>
                    <StyledText style={[styles.emptyText, { color: colors.PLACEHOLDER }]}>
                        {t('today_no_tasks')}
                    </StyledText>
                    <StyledText style={[styles.emptySubtext, { color: colors.PLACEHOLDER }]}>
                        {t('today_have_nice_day')}
                    </StyledText>
                </View>
            ) : (
                <View style={styles.tasksContainer}>
                    {todayTasks.slice(0, 2).map((task, index) => (
                        <Pressable
                            key={task.id}
                            style={({ pressed }) => [
                                styles.taskItem,
                                {
                                    backgroundColor: colors.PRIMARY_BACKGROUND,
                                    borderLeftColor: getPriorityColor(task, index),
                                    opacity: pressed ? 0.7 : 1,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                            onPress={handleTaskPress}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.taskContent, { flex: 1 }]}>
                                    <View style={styles.taskHeader}>
                                        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task, index) }]} />
                                        <StyledText
                                            style={[styles.taskTitle, { color: colors.PRIMARY_TEXT }]}
                                            numberOfLines={1}
                                        >
                                            {task.title}
                                        </StyledText>
                                    </View>
                                    <View style={styles.taskFooter}>
                                        <View style={styles.timeContainer}>
                                            <Ionicons name="time-outline" size={11} color={colors.PLACEHOLDER} />
                                            <StyledText style={[styles.timeText, { color: colors.PLACEHOLDER }]}>
                                                {getTimeFromReminder(task.reminder!)}
                                            </StyledText>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={14} color={colors.PLACEHOLDER} style={{ marginLeft: 8 }} />
                            </View>
                        </Pressable>
                    ))}
                    {todayTasks.length > 2 && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.viewAllButton,
                                {
                                    backgroundColor: '#3B82F6',
                                    opacity: pressed ? 0.9 : 1,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                            onPress={handleViewAll}
                        >
                            <StyledText style={styles.viewAllText}>
                                {t('today_view_more')} ({todayTasks.length - 2})
                            </StyledText>
                            <Ionicons name="arrow-forward" size={14} color="#FFF" />
                        </Pressable>
                    )}
                </View>
            )}

            <View style={[homeStyles.decorativeCircle, { backgroundColor: 'rgba(20, 184, 166, 0.1)' }]} />

            <TodayTasksModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tasks={todayTasks}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        opacity: 0.3,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        opacity: 0.7,
    },
    tasksContainer: {
        gap: 4,
    },
    taskItem: {
        borderRadius: 10,
        paddingVertical: 8, // Increased from 6
        paddingHorizontal: 12,
        borderLeftWidth: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    taskContent: {
        gap: 4, // Increased from 2
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    priorityDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    taskTitle: {
        fontSize: 14, // Back to 14
        fontWeight: '600',
        flex: 1,
    },
    taskFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 14,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 9, // Increased from 9
        fontWeight: '500',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32, // Reduced height
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 6,
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    viewAllText: {
        color: '#FFF',
        fontSize: 12, // Reduced font size
        fontWeight: '600',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
