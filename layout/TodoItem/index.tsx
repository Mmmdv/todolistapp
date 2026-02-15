import StyledCheckBox from "@/components/StyledCheckBox"
import StyledText from "@/components/StyledText"
import { COLORS } from "@/constants/ui"
import { formatDate } from "@/helpers/date"
import { Todo } from "@/types/todo"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useEffect, useRef, useState } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import ArchiveTodoModal from "../Modals/ArchiveTodoModal.tsx"
import DeleteTodoModal from "../Modals/DeleteTodoModal.tsx"
import EditTodoModal from "../Modals/EditTodoModal.tsx"
import ViewTodoModal from "../Modals/ViewTodoModal.tsx"
import CelebrationEffect, { CelebrationType, createCelebrationAnimations, playCelebration } from "./CelebrationEffect"
import { styles } from "./styles"

import { useAppSelector } from "@/store"
import { selectNotificationById } from "@/store/slices/notificationSlice"

type TodoItemProps = Todo & {
    reminder?: string;
    reminderCancelled?: boolean;
    checkTodo: (id: Todo["id"]) => void
    deleteTodo: (id: Todo["id"]) => void
    editTodo: (id: Todo["id"], title: Todo["title"], reminder?: string, notificationId?: string) => void
    archiveTodo?: (id: Todo["id"]) => void
    categoryTitle?: string
    categoryIcon?: string
}

import { useTheme } from "@/hooks/useTheme"

const TodoItem: React.FC<TodoItemProps> = ({ id, title, isCompleted, isArchived, createdAt, completedAt, updatedAt, archivedAt, reminder, reminderCancelled, notificationId, checkTodo, deleteTodo, editTodo, archiveTodo, categoryTitle, categoryIcon }) => {
    const { t, notificationsEnabled } = useTheme();

    // Look up status from notification history centralized data
    const notification = useAppSelector(state => notificationId ? selectNotificationById(state, notificationId) : undefined);
    const reminderStatus = notification?.status;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [showCelebrate, setShowCelebrate] = useState(false)
    const [celebrationType, setCelebrationType] = useState<CelebrationType>('idea')

    const ideaAnimations = useRef(createCelebrationAnimations()).current

    const onPressDelete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setIsDeleteModalOpen(true);
    }

    const onPressArchive = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setIsArchiveModalOpen(true);
    }

    const onPressEdit = () => {
        setIsEditModalOpen(true)
    }

    const handleCheckToken = () => {
        // Light haptic feedback for both checking and unchecking
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (!isCompleted) {
            setCelebrationType('star')
            playCelebration(ideaAnimations, setShowCelebrate)
            setTimeout(() => { checkTodo(id) }, 600)
        } else {
            checkTodo(id)
        }
    }

    // Check if it's a new task (created within last 2 seconds)
    useEffect(() => {
        const now = new Date().getTime()
        const created = new Date(createdAt).getTime()
        if (now - created < 2000) {
            setCelebrationType('idea')
            playCelebration(ideaAnimations, setShowCelebrate)
        }
    }, [])

    // Enter animation
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0.9)).current
    const translateAnim = useRef(new Animated.Value(20)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
            Animated.spring(translateAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }),
        ]).start();
    }, []);

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.PRIMARY_BORDER_DARK, COLORS.SECONDARY_BACKGROUND],
    });

    return (
        <Animated.View style={[
            styles.container,
            {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateY: translateAnim }],
                backgroundColor,
            }
        ]}>
            <View style={styles.checkTitleContainer}>
                {!isArchived && (
                    <View style={styles.checkboxWrapper}>
                        <StyledCheckBox checked={isCompleted} onCheck={handleCheckToken} />
                        <CelebrationEffect
                            animations={ideaAnimations}
                            celebrationType={celebrationType}
                            visible={showCelebrate}
                        />
                    </View>
                )}
                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={() => setIsViewModalOpen(true)}
                    onLongPress={handleCheckToken}
                    activeOpacity={0.7}
                >
                    <View style={{ flex: 1 }}>
                        <StyledText
                            style={[{
                                fontSize: 14,
                                opacity: isArchived ? 0.9 : (isCompleted ? 0.6 : 1),
                                textDecorationLine: (isCompleted && !isArchived) ? 'line-through' : 'none',
                                color: (isCompleted && !isArchived) ? COLORS.PLACEHOLDER : COLORS.PRIMARY_TEXT,
                            }]}>
                            {title}
                        </StyledText>
                    </View>
                    {!isCompleted && createdAt && !updatedAt && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 }}>
                            <Ionicons name="add" size={14} color="#50dce0ff" />
                            <StyledText style={[styles.dateText, { fontSize: 11, marginTop: 0 }]}>
                                {formatDate(createdAt)}
                            </StyledText>
                        </View>
                    )}
                    {!isCompleted && updatedAt && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 }}>
                            <Ionicons name="create-outline" size={14} color="#5BC0EB" />
                            <StyledText style={[styles.dateText, { color: '#5BC0EB', fontSize: 11, marginTop: 0 }]}>
                                {formatDate(updatedAt)}
                            </StyledText>
                        </View>
                    )}
                    {isCompleted && !isArchived && completedAt && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 }}>
                            <Ionicons name="checkmark-done-outline" size={14} color="#69c4dbe8" />
                            <StyledText style={{ color: '#69c4dbe8', fontSize: 11 }}>
                                {formatDate(completedAt)}
                            </StyledText>
                        </View>
                    )}
                    {!isCompleted && !isArchived && reminder && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons
                                    name="alarm-outline"
                                    size={14}
                                    color="#FFD166"
                                />
                                <StyledText style={{
                                    color: "#FFD166",
                                    fontSize: 11,
                                    textDecorationLine: (reminderStatus === 'Ləğv olunub' || reminderStatus === 'Dəyişdirilib və ləğv olunub' || reminderCancelled) ? 'line-through' : 'none'
                                }}>
                                    {formatDate(reminder)}
                                </StyledText>
                            </View>

                            {reminderStatus && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    {reminderStatus === 'Ləğv olunub' || reminderStatus === 'Dəyişdirilib və ləğv olunub' || reminderCancelled ? (
                                        <Ionicons name="notifications-off" size={14} color={COLORS.ERROR_INPUT_TEXT} />
                                    ) : reminderStatus === 'Göndərilib' ? (
                                        <Ionicons name="checkmark-done-circle-outline" size={14} color={COLORS.CHECKBOX_SUCCESS} />
                                    ) : (
                                        <Ionicons name="hourglass-outline" size={14} color="#FFB74D" />
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.controlsContainer} onStartShouldSetResponder={() => true}>
                {!isCompleted && !isArchived && (
                    <>
                        <TouchableOpacity onPress={onPressEdit} activeOpacity={0.7}>
                            <Ionicons name="create-outline" size={24} color={COLORS.PRIMARY_TEXT} />
                        </TouchableOpacity>
                        <EditTodoModal
                            title={title}
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onUpdate={(title, reminder, notificationId) => editTodo(id, title, reminder, notificationId)}
                            reminder={reminder}
                            reminderCancelled={reminderCancelled}
                            notificationId={notificationId}
                            categoryTitle={categoryTitle}
                            categoryIcon={categoryIcon}
                        />
                        <TouchableOpacity onPress={onPressDelete} activeOpacity={0.7}>
                            <Ionicons name="trash-outline" size={24} color={COLORS.PRIMARY_TEXT} />
                        </TouchableOpacity>
                        <DeleteTodoModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            onDelete={() => deleteTodo(id)}
                        />
                    </>
                )}
                {isCompleted && !isArchived && archiveTodo && (
                    <TouchableOpacity onPress={onPressArchive} activeOpacity={0.7}>
                        <Ionicons name="archive-outline" size={24} color={COLORS.PRIMARY_TEXT} />
                    </TouchableOpacity>
                )}
                {archiveTodo && (
                    <ArchiveTodoModal
                        isOpen={isArchiveModalOpen}
                        onClose={() => setIsArchiveModalOpen(false)}
                        onArchive={() => archiveTodo(id)}
                    />
                )}
                {isArchived && (
                    <TouchableOpacity onPress={() => setIsViewModalOpen(true)} activeOpacity={0.7}>
                        <Ionicons name="information-circle-outline" size={24} color={COLORS.PRIMARY_TEXT} />
                    </TouchableOpacity>
                )}
                <ViewTodoModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title={title}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                    completedAt={completedAt}
                    reminder={reminder}
                    reminderCancelled={reminderCancelled}
                    notificationId={notificationId}
                />
            </View>
        </Animated.View>
    )
}

export default TodoItem