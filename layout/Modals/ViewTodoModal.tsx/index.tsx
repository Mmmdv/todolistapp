import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { modalStyles } from "@/constants/modalStyles";
import { COLORS } from "@/constants/ui";
import { formatDate } from "@/helpers/date";
import { useTheme } from "@/hooks/useTheme";
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
    reminder?: string
    reminderCancelled?: boolean
};

const ViewTodoModal: React.FC<ViewTodoModalProps> = ({
    isOpen,
    onClose,
    title,
    createdAt,
    updatedAt,
    completedAt,
    reminder,
    reminderCancelled
}) => {
    const { t } = useTheme();

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={[modalStyles.modalContainer, localStyles.container]}>
                <View style={[modalStyles.iconContainer, {
                    backgroundColor: useTheme().colors.SECONDARY_BACKGROUND,
                    shadowColor: "#4ECDC4",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5
                }]}>
                    <Ionicons name="checkmark-done-circle" size={28} color="#4ECDC4" />
                </View>

                <StyledText style={[modalStyles.headerText, localStyles.headerText]}>{t("task_details")}</StyledText>

                <View style={modalStyles.divider} />

                <View style={localStyles.detailsContainer}>
                    <View style={localStyles.detailRow}>
                        <StyledText style={localStyles.label}>{t("title")}</StyledText>
                        <StyledText style={localStyles.value}>{title}</StyledText>
                    </View>

                    <View style={localStyles.detailRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="time-outline" size={16} color="#eceaeaff" />
                            <StyledText style={localStyles.label}>{t("created")}</StyledText>
                        </View>
                        <StyledText style={localStyles.value}>{formatDate(createdAt)}</StyledText>
                    </View>

                    {updatedAt && (
                        <View style={localStyles.detailRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Ionicons name="create-outline" size={16} color="#5BC0EB" />
                                <StyledText style={localStyles.label}>{t("edited")}</StyledText>
                            </View>
                            <StyledText style={[localStyles.value, { color: '#5BC0EB' }]}>
                                {formatDate(updatedAt)}
                            </StyledText>
                        </View>
                    )}

                    {completedAt && (
                        <View style={localStyles.detailRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Ionicons name="checkmark-circle-outline" size={16} color="#4ECDC4" />
                                <StyledText style={localStyles.label}>{t("completed")}</StyledText>
                            </View>
                            <StyledText style={[localStyles.value, { color: '#4ECDC4' }]}>
                                {formatDate(completedAt)}
                            </StyledText>
                        </View>
                    )}

                    {reminder && (
                        <View style={localStyles.detailRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Ionicons name="alarm-outline" size={16} color="#FFD166" />
                                <StyledText style={localStyles.label}>{t("reminder")}</StyledText>
                            </View>
                            <View>
                                <StyledText style={[localStyles.value, { color: '#FFD166' }]}>
                                    {formatDate(reminder)}
                                </StyledText>
                                {reminderCancelled ? (
                                    <StyledText style={{ fontSize: 10, color: COLORS.ERROR_INPUT_TEXT, fontWeight: '600' }}>
                                        {t("canceled")}
                                    </StyledText>
                                ) : new Date(reminder) > new Date() ? (
                                    <StyledText style={{ fontSize: 10, color: "#FFB74D", fontWeight: '600' }}>
                                        {t("pending")}
                                    </StyledText>
                                ) : (
                                    <StyledText style={{ fontSize: 10, color: COLORS.CHECKBOX_SUCCESS, fontWeight: '600' }}>
                                        {t("sent")}
                                    </StyledText>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                <View style={[modalStyles.buttonsContainer, { justifyContent: "center" }]}>
                    <StyledButton
                        label={t("close")}
                        onPress={onClose}
                        variant="dark_button"
                    />
                </View>
            </View>
        </StyledModal>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 24,
        minWidth: 320,
        gap: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    detailsContainer: {
        width: "100%",
        gap: 16,
    },
    detailRow: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        color: "#aca9a9ff",
        fontWeight: "500",
        letterSpacing: 0.2,
    },
    value: {
        fontSize: 12,
        color: COLORS.PRIMARY_TEXT,
        fontWeight: "500",
        lineHeight: 20,
    },
})

export default ViewTodoModal
