import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { COLORS } from "@/constants/ui";
import { Todo } from "@/types/todo";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type ViewTodoModalProps = {
    isOpen: boolean
    onClose: () => void
    title: Todo["title"]
    createdAt: Todo["createdAt"]
    updatedAt?: Todo["updatedAt"]
    completedAt?: Todo["completedAt"]
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeStr = date.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
    return `${dateStr} ${timeStr}`
}

const ViewTodoModal: React.FC<ViewTodoModalProps> = ({
    isOpen,
    onClose,
    title,
    createdAt,
    updatedAt,
    completedAt,
}) => {

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-done-circle" size={28} color="#4ECDC4" />
                </View>

                <StyledText style={styles.headerText}>Task details</StyledText>

                <View style={styles.divider} />

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <StyledText style={styles.label}>Title</StyledText>
                        <StyledText style={styles.value}>{title}</StyledText>
                    </View>

                    <View style={styles.detailRow}>
                        <StyledText style={styles.label}>🕐 Created</StyledText>
                        <StyledText style={styles.value}>{formatDate(createdAt)}</StyledText>
                    </View>

                    {updatedAt && (
                        <View style={styles.detailRow}>
                            <StyledText style={styles.label}>✏️ Edited</StyledText>
                            <StyledText style={[styles.value, { color: '#5BC0EB' }]}>
                                {formatDate(updatedAt)}
                            </StyledText>
                        </View>
                    )}

                    {completedAt && (
                        <View style={styles.detailRow}>
                            <StyledText style={styles.label}>✅ Completed</StyledText>
                            <StyledText style={[styles.value, { color: '#4ECDC4' }]}>
                                {formatDate(completedAt)}
                            </StyledText>
                        </View>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <StyledButton
                        label="Close"
                        onPress={onClose}
                        variant="blue_button"
                    />
                </View>
            </View>
        </StyledModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#3a3f47",
        padding: 24,
        minWidth: 320,
        alignItems: "center",
        gap: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(78, 205, 196, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.PRIMARY_TEXT,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#3a3f47",
        width: "100%",
        marginBottom: 8,
    },
    detailsContainer: {
        width: "100%",
        gap: 16,
    },
    detailRow: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        color: "#888",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: COLORS.PRIMARY_TEXT,
        fontWeight: "500",
        lineHeight: 22,
    },
    buttonsContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center", // Centered close button
        marginTop: 12,
    },
})

export default ViewTodoModal
