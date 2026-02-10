import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { modalStyles } from "@/constants/modalStyles";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type ArchiveTodoModalProps = {
    isOpen: boolean
    onClose: () => void
    onArchive: () => void
};

const ArchiveTodoModal: React.FC<ArchiveTodoModalProps> = ({
    isOpen,
    onClose,
    onArchive,
}) => {

    const handleArchive = () => {
        onArchive()
        onClose()
    }

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={modalStyles.modalContainer}>
                <View style={[modalStyles.iconContainer, { backgroundColor: "rgba(136, 136, 136, 0.15)" }]}>
                    <Ionicons name="archive-outline" size={28} color="#888" />
                </View>

                <StyledText style={modalStyles.headerText}>Archive task?</StyledText>

                <View style={modalStyles.divider} />

                <StyledText style={modalStyles.messageText}>
                    This task will be moved to archive.
                </StyledText>

                <View style={modalStyles.buttonsContainer}>
                    <StyledButton
                        label="Cancel"
                        onPress={onClose}
                        variant="blue_button"
                    />
                    <StyledButton
                        label="Archive"
                        onPress={handleArchive}
                        variant="blue_button"
                    />
                </View>
            </View>
        </StyledModal>
    );
};

export default ArchiveTodoModal
