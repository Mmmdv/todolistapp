import GestureWrapper from "@/components/GestureWrapper";
import ApplicationSection from "@/components/settings/sections/ApplicationSection";
import LanguageSection from "@/components/settings/sections/LanguageSection";
import NotificationSection from "@/components/settings/sections/NotificationSection";
import SecuritySection from "@/components/settings/sections/SecuritySection";
import ThemeSection from "@/components/settings/sections/ThemeSection";
import StyledText from "@/components/StyledText";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const { colors, t } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <GestureWrapper>
            <View style={[styles.mainContainer, { backgroundColor: colors.PRIMARY_BACKGROUND }]}>
                <View style={[
                    styles.header,
                    {
                        borderBottomColor: colors.PRIMARY_BORDER_DARK,
                        backgroundColor: colors.SECONDARY_BACKGROUND,
                        paddingTop: insets.top + 16
                    }
                ]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.PRIMARY_TEXT} />
                    </TouchableOpacity>

                    <View style={[styles.titleContainer, { paddingTop: insets.top + 16, paddingBottom: 16 }]} pointerEvents="none">
                        <StyledText style={[styles.headerTitle, { color: colors.PRIMARY_TEXT }]}>
                            {t("settings")}
                        </StyledText>
                    </View>

                    <View style={styles.rightPlaceholder} />
                </View>

                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 40 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <LanguageSection />
                    <View style={[styles.divider, { backgroundColor: colors.PRIMARY_BORDER }]} />

                    <ThemeSection />
                    <View style={[styles.divider, { backgroundColor: colors.PRIMARY_BORDER }]} />

                    <NotificationSection visible={true} />
                    <View style={[styles.divider, { backgroundColor: colors.PRIMARY_BORDER }]} />

                    <SecuritySection />
                    <View style={[styles.divider, { backgroundColor: colors.PRIMARY_BORDER }]} />

                    <ApplicationSection />
                </ScrollView>
            </View>
        </GestureWrapper>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        position: 'relative',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        zIndex: 10,
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    rightPlaceholder: {
        minWidth: 40,
        alignItems: 'flex-end',
        zIndex: 10,
    },
    scrollContainer: {
        padding: 20,
    },
    divider: {
        height: 0.4,
        width: '100%',
        marginVertical: 20,
        opacity: 0.4,
    },
});
