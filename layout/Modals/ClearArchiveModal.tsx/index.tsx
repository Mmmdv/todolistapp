import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { modalStyles } from "@/constants/modalStyles";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type ClearArchiveModalProps = {
    isOpen: boolean
    onClose: () => void
    onClear: () => void
};

const ClearArchiveModal: React.FC<ClearArchiveModalProps> = ({
    isOpen,
    onClose,
    onClear,
}) => {

    const handleClear = () => {
        onClear()
        onClose()
    }

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={modalStyles.modalContainer}>
                <View style={[modalStyles.iconContainer, { backgroundColor: "rgba(255, 107, 107, 0.15)" }]}>
                    <Ionicons name="trash-outline" size={28} color="#FF6B6B" />
                </View>

                <StyledText style={modalStyles.headerText}>Clear archive?</StyledText>

                <View style={modalStyles.divider} />

                <StyledText style={modalStyles.messageText}>
                    Are you sure you want to delete all archived tasks? This action cannot be undone.
                </StyledText>

                <View style={modalStyles.buttonsContainer}>
                    <StyledButton
                        label="Cancel"
                        onPress={onClose}
                        variant="blue_button"
                    />
                    <StyledButton
                        label="Clear All"
                        onPress={handleClear}
                        variant="delete_button"
                    />
                </View>
            </View>
        </StyledModal>
    );
};

export default ClearArchiveModal
