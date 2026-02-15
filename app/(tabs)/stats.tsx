import StyledText from "@/components/StyledText";
import MonthlyStats from "@/components/today/MonthlyStats";
import { styles } from "@/constants/homeStyles";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Stats() {
    const { colors, t } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.PRIMARY_BACKGROUND }]}>
            <View style={styles.header}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <StyledText style={[styles.greeting, { color: colors.PRIMARY_TEXT, fontSize: 24, fontWeight: 'bold' }]}>
                        {t("tab_stats")}
                    </StyledText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <MonthlyStats />
            </ScrollView>
        </View>
    );
}
