import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { modalStyles } from "@/constants/modalStyles";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

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
            <View style={modalStyles.modalContainer}>
                <View style={[modalStyles.iconContainer, { backgroundColor: "rgba(78, 205, 196, 0.15)" }]}>
                    <Ionicons name="archive-outline" size={28} color="#4ECDC4" />
                </View>

                <StyledText style={modalStyles.headerText}>Archive All?</StyledText>

                <View style={modalStyles.divider} />

                <StyledText style={modalStyles.messageText}>
                    Are you sure you want to archive all completed tasks?
                </StyledText>

                <View style={modalStyles.buttonsContainer}>
                    <StyledButton
                        label="Cancel"
                        onPress={onClose}
                        variant="blue_button"
                    />
                    <StyledButton
                        label="Archive All"
                        onPress={handleArchiveAll}
                        style={{ backgroundColor: "#4ECDC4" }}
                    />
                </View>
            </View>
        </StyledModal>
    );
};

export default ArchiveAllModal;
