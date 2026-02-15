import StyledText from "@/components/StyledText";
import CurrencyRates from "@/components/today/CurrencyRates";
import MoodTracker from "@/components/today/MoodTracker";
import RatingTracker from "@/components/today/RatingTracker";
import Weather from "@/components/today/Weather";
import WeightTracker from "@/components/today/WeightTracker";

import { styles } from "@/constants/homeStyles";
import { useLocation } from "@/hooks/useLocation";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Today() {
    const { colors, t } = useTheme();
    const { city } = useLocation();

    return (
        <View style={[styles.container, { backgroundColor: colors.PRIMARY_BACKGROUND }]}>
            <View style={styles.header}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <StyledText style={[styles.greeting, { color: colors.PRIMARY_TEXT, fontSize: 24, fontWeight: 'bold' }]}>
                        {t("tab_today")}
                    </StyledText>
                    {city && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="location-sharp" size={14} color={colors.PLACEHOLDER} style={{ marginRight: 4 }} />
                            <StyledText style={{ color: colors.PLACEHOLDER, fontSize: 14 }}>
                                {city}
                            </StyledText>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <MoodTracker />
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <WeightTracker />
                    </View>
                    <View style={{ flex: 1 }}>
                        <RatingTracker />
                    </View>
                </View>
                <CurrencyRates />
                <Weather />
            </ScrollView>
        </View>
    );
}
