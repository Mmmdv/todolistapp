import StyledText from "@/components/StyledText"
import { COLORS } from "@/constants/ui"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

export type SortBy = "date" | "text"
export type SortOrder = "asc" | "desc"

type SortControlsProps = {
    sortBy: SortBy
    sortOrder: SortOrder
    onToggleSortBy: () => void
    onToggleSortOrder: () => void
}

const SortControls: React.FC<SortControlsProps> = ({
    sortBy,
    sortOrder,
    onToggleSortBy,
    onToggleSortOrder,
}) => (
    <View style={sortStyles.sortContainer}>
        <TouchableOpacity style={sortStyles.sortButton} onPress={onToggleSortBy}>
            <Ionicons
                name={sortBy === "date" ? "calendar" : "text"}
                size={14}
                color={COLORS.PRIMARY_TEXT}
            />
            <StyledText style={sortStyles.sortText}>
                {sortBy === "date" ? "Tarix" : "Text"}
            </StyledText>
        </TouchableOpacity>
        <TouchableOpacity style={sortStyles.sortButton} onPress={onToggleSortOrder}>
            <Ionicons
                name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                size={14}
                color={COLORS.PRIMARY_TEXT}
            />
        </TouchableOpacity>
    </View>
)

const sortStyles = StyleSheet.create({
    sortContainer: {
        flexDirection: "row",
        gap: 5,
        marginRight: 10,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2a2f37",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 3,
    },
    sortText: {
        fontSize: 10,
        color: COLORS.PRIMARY_TEXT,
    },
})

export default SortControls
