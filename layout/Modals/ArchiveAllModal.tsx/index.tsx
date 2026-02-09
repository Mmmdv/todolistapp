import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { COLORS } from "@/constants/ui";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type ArchiveAllModalProps = {
    isOpen: boolean
    onClose: () => void
    onArchiveAll: () => void
};

const ArchiveAllModal: React.FC<ArchiveAllModalProps> = ({
    isOpen,
    onClose,
    onArchiveAll,
}) => {

    const handleArchiveAll = () => {
        onArchiveAll()
        onClose()
    }

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="archive-outline" size={28} color="#4ECDC4" />
                </View>

                <StyledText style={styles.headerText}>Archive All?</StyledText>

                <View style={styles.divider} />

                <StyledText style={styles.messageText}>
                    Are you sure you want to archive all completed tasks?
                </StyledText>

                <View style={styles.buttonsContainer}>
                    <StyledButton
                        label="Cancel"
                        onPress={onClose}
                        variant="blue_button" // Assuming this variant exists/is appropriate for cancel
                    // Or we can use a neutral variant if available, but blue_button is fine for now based on ClearArchiveModal
                    />
                    <StyledButton
                        label="Archive All"
                        onPress={handleArchiveAll}
                        style={{ backgroundColor: "#4ECDC4" }} // Custom color for Archive action
                    />
                </View>
            </View>
        </StyledModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: "#3a3f47",
        padding: 20,
        minWidth: 280,
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(78, 205, 196, 0.15)", // Matching icon color
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.PRIMARY_TEXT,
        marginBottom: 5,
    },
    divider: {
        height: 0.5,
        backgroundColor: "#3a3f47",
        width: "100%",
        marginBottom: 10,
    },
    messageText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 5,
    },
})

export default ArchiveAllModal;
