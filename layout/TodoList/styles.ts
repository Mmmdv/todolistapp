import { COLORS } from "@/constants/ui"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.PRIMARY_TEXT,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.PLACEHOLDER,
    },
    sectionContainer: {
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    sectionTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.PRIMARY_TEXT,
    },
    sectionControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    sectionDivider: {
        height: 0.5,
        backgroundColor: "#3a3f47",
        marginHorizontal: 15,
        marginVertical: 10,
    },
})
