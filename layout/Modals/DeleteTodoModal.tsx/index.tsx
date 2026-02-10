import StyledButton from "@/components/StyledButton";
import StyledModal from "@/components/StyledModal";
import StyledText from "@/components/StyledText";
import { modalStyles } from "@/constants/modalStyles";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

type DeleteTodoModalProps = {
    isOpen: boolean
    onClose: () => void
    onDelete: () => void
};

const DeleteTodoModal: React.FC<DeleteTodoModalProps> = ({
    isOpen,
    onClose,
    onDelete }) => {

    return (
        <StyledModal isOpen={isOpen} onClose={onClose}>
            <View style={modalStyles.modalContainer}>
                <View style={[modalStyles.iconContainer, { backgroundColor: "rgba(255, 107, 107, 0.15)" }]}>
                    <Ionicons name="trash-outline" size={28} color="#FF6B6B" />
                </View>

                <StyledText style={modalStyles.headerText}>Delete task</StyledText>

                <View style={modalStyles.divider} />

                <StyledText style={modalStyles.messageText}>
                    Are you sure you want to delete this task?
                </StyledText>

                <View style={modalStyles.buttonsContainer}>
                    <StyledButton
                        label="Cancel"
                        onPress={onClose}
                        variant="blue_button"
                    />
                    <StyledButton
                        label="Delete"
                        onPress={onDelete}
                        variant="blue_button"
                    />
                </View>
            </View>
        </StyledModal>
    );
};

export default DeleteTodoModal
