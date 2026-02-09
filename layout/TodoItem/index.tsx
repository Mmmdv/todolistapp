import StyledCheckBox from "@/components/StyledCheckBox"
import StyledText from "@/components/StyledText"
import { COLORS } from "@/constants/ui"
import { Todo } from "@/types/todo"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import ArchiveTodoModal from "../Modals/ArchiveTodoModal.tsx"
import DeleteTodoModal from "../Modals/DeleteTodoModal.tsx"
import EditTodoModal from "../Modals/EditTodoModal.tsx"
import ViewTodoModal from "../Modals/ViewTodoModal.tsx"

type TodoItemProps = Todo & {
    checkTodo: (id: Todo["id"]) => void
    deleteTodo: (id: Todo["id"]) => void
    editTodo: (id: Todo["id"], title: Todo["title"]) => void
    archiveTodo?: (id: Todo["id"]) => void
}

const IDEA_COLORS = ["#FFD700", "#FFA500", "#FFFF00", "#FCD34D", "#F59E0B"]
const STAR_COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F97316"]

const TodoItem: React.FC<TodoItemProps> = ({ id, title, isCompleted, isArchived, createdAt, completedAt, updatedAt, archivedAt, checkTodo, deleteTodo, editTodo, archiveTodo }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const dateStr = date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
        const timeStr = date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
        return `${dateStr} ${timeStr}`
    }

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [showCelebrate, setShowCelebrate] = useState(false)
    const [celebrationType, setCelebrationType] = useState<'idea' | 'star'>('idea')

    // Animation values for 5 ideas
    const ideaAnimations = useRef(
        Array.from({ length: 5 }, () => ({
            scale: new Animated.Value(0),
            opacity: new Animated.Value(0),
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
        }))
    ).current

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

    // Handle check with animation
    const handleCheckToken = () => {
        if (!isCompleted) {
            setCelebrationType('star')
            playCelebration()
            // Delay the actual check action to let animation play
            setTimeout(() => {
                checkTodo(id)
            }, 600) // Slightly shorter than animation duration
        } else {
            checkTodo(id)
        }
    }

    // Check if it's a new task (created within last 2 seconds)
    useEffect(() => {
        const now = new Date().getTime()
        const created = new Date(createdAt).getTime()
        // If created within last 2 seconds (to be safe against re-renders)
        if (now - created < 2000) {
            setCelebrationType('idea')
            playCelebration()
        }
    }, [])

    const playCelebration = () => {
        setShowCelebrate(true)

        // Reset animations
        ideaAnimations.forEach((anim) => {
            anim.scale.setValue(0)
            anim.opacity.setValue(1)
            anim.translateX.setValue(0)
            anim.translateY.setValue(0)
        })

        // Start animations for each idea with different delays
        const animations = ideaAnimations.map((anim, index) => {
            const angle = (index / 5) * 2 * Math.PI
            const distance = 80 + Math.random() * 60

            return Animated.parallel([
                Animated.sequence([
                    Animated.timing(anim.scale, {
                        toValue: 2.0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.scale, {
                        toValue: 0.8,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(anim.translateX, {
                    toValue: Math.cos(angle) * distance,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.translateY, {
                    toValue: Math.sin(angle) * distance - 40,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.opacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        })

        Animated.stagger(100, animations).start(() => {
            setShowCelebrate(false)
        })
    }

    const onCheckTodo = () => {
        if (!isCompleted) {
            playCelebration()
            // Delay check so animation plays before item moves to Done section
            setTimeout(() => {
                checkTodo(id)
            }, 800)
        } else {
            checkTodo(id)
        }
    }

    // Enter animation
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity
    const scaleAnim = useRef(new Animated.Value(0.9)).current; // Scale
    const translateAnim = useRef(new Animated.Value(20)).current; // Slide up

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(translateAnim, {
                toValue: 0,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.PRIMARY_BORDER_DARK, COLORS.SECONDARY_BACKGROUND] // Flash effect
        // Flash from a slightly lighter/border color to background
    });

    return (
        <Animated.View style={[
            styles.container,
            {
                opacity: fadeAnim,
                transform: [
                    { scale: scaleAnim },
                    { translateY: translateAnim }
                ],
                backgroundColor: backgroundColor // Animated background
            }
        ]}>
            <View style={styles.checKTitleConainer}>
                {!isArchived && (
                    <View style={styles.checkboxWrapper}>
                        <StyledCheckBox
                            checked={isCompleted}
                            onCheck={handleCheckToken} />
                        {showCelebrate && ideaAnimations.map((anim, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.star,
                                    {
                                        transform: [
                                            { scale: anim.scale },
                                            { translateX: anim.translateX },
                                            { translateY: anim.translateY },
                                        ],
                                        opacity: anim.opacity,
                                    }
                                ]}
                            >
                                <Ionicons
                                    name={celebrationType === 'idea' ? "bulb" : "star"}
                                    size={24}
                                    color={celebrationType === 'idea' ? IDEA_COLORS[index] : STAR_COLORS[index]}
                                />
                            </Animated.View>
                        ))}
                    </View>
                )}
                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={isCompleted ? () => setIsViewModalOpen(true) : handleCheckToken}
                    activeOpacity={0.7}
                >
                    <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
                        {/* alignSelf: flex-start ensures container wraps text tightly so line is correct width */}
                        <StyledText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[{
                                fontSize: 14,
                                flexShrink: 1,
                                opacity: isArchived ? 0.9 : (isCompleted ? 0.7 : 1),
                            }]}>
                            {title}
                        </StyledText>
                        {isCompleted && !isArchived && (
                            <View style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: '50%',
                                height: 1,
                                backgroundColor: COLORS.PRIMARY_TEXT, // Or '#888' if too dark
                                opacity: 0.4 // "More clear" (was 0.2)
                            }} />
                        )}
                    </View>
                    {/* Pending items show create date and edit date */}
                    {!isCompleted && createdAt && (
                        <StyledText style={styles.dateText}>
                            🕐 {formatDate(createdAt)}
                        </StyledText>
                    )}
                    {!isCompleted && updatedAt && (
                        <StyledText style={[styles.dateText, { color: '#5BC0EB' }]}>
                            ✏️ {formatDate(updatedAt)}
                        </StyledText>
                    )}
                    {/* Completed items show only done date */}
                    {isCompleted && !isArchived && completedAt && (
                        <StyledText style={[styles.dateText, { color: '#4ECDC4', fontSize: 10 }]}>
                            ✅ {formatDate(completedAt)} • Tap for details
                        </StyledText>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.controlsContainer} onStartShouldSetResponder={() => true}>

                {/* Pending items: edit and delete buttons */}
                {!isCompleted && !isArchived && (
                    <>
                        <TouchableOpacity onPress={onPressEdit} activeOpacity={0.7}>
                            <Ionicons name="create-outline" size={24} color={COLORS.PRIMARY_TEXT} />
                        </TouchableOpacity>
                        <EditTodoModal
                            title={title}
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onUpdate={(title) => editTodo(id, title)} />

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

                {/* Done items: archive button only */}
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

                {/* Archived items: info button only */}
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
                />

            </View>
        </Animated.View >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 12,
        overflow: "visible",
        borderWidth: 0.3,
        borderColor: COLORS.PRIMARY_BORDER_DARK,
    },
    controlsContainer: {
        flexDirection: "row",
        paddingHorizontal: 0,
        paddingVertical: 0,
        gap: 8,
    },
    checKTitleConainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        flex: 1,
        flexShrink: 1,
        marginRight: 25, // Increased safe zone
        overflow: "visible",
    },
    checkboxWrapper: {
        position: "relative",
        overflow: "visible",
    },
    star: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
    },
    textContainer: {
        flex: 1,
        flexShrink: 1,
    },
    dateText: {
        fontSize: 11,
        color: "#aaa",
        marginTop: 2,
    }
})
export default TodoItem