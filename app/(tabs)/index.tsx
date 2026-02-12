import StyledText from "@/components/StyledText";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const GAP = 12;
const PADDING = 20;
// Width for 2-column row
const COL_2_WIDTH = (width - (PADDING * 2) - GAP) / 2;
// Width for 3-column row
const COL_3_WIDTH = (width - (PADDING * 2) - (GAP * 2)) / 3;

export default function Home() {
    const { colors, t, username } = useTheme();
    const router = useRouter();

    const features = [
        {
            id: 'todo',
            title: t("tab_todo"),
            description: t("home_plan_day"),
            icon: "checkbox" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/todo",
            color: "#4F46E5", // Indigo
            iconColor: "#FFF"
        },
        {
            id: 'movies',
            title: t("tab_movies"),
            description: t("home_movies_desc"),
            icon: "film" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/movies",
            color: "#E11D48", // Rose
            iconColor: "#FFF"
        },
        {
            id: 'birthday',
            title: t("tab_birthday"),
            description: t("home_birthdays_desc"),
            icon: "gift" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/birthday",
            color: "#F59E0B", // Amber
            iconColor: "#FFF"
        },
        {
            id: 'shopping',
            title: t("tab_shopping"),
            description: t("home_shopping_desc"),
            icon: "cart" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/shopping",
            color: "#06B6D4", // Cyan
            iconColor: "#FFF"
        },
        {
            id: 'events',
            title: t("tab_events"),
            description: t("home_events_desc"),
            icon: "calendar" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/events",
            color: "#8B5CF6", // Violet
            iconColor: "#FFF"
        },
        {
            id: 'expenses',
            title: t("tab_expenses"),
            description: t("home_expenses_desc"),
            icon: "wallet" as keyof typeof Ionicons.glyphMap,
            route: "/(tabs)/expenses",
            color: "#10B981", // Emerald
            iconColor: "#FFF"
        }
    ];

    const handlePress = (route: string) => {
        router.push(route as any);
    };

    const renderCard = (item: any, width: number, height: number = 150, isFullWidth: boolean = false) => {
        return (
            <Pressable
                key={item.id}
                style={({ pressed }) => [
                    styles.card,
                    {
                        backgroundColor: item.color,
                        width: width,
                        height: height,
                        opacity: pressed ? 0.9 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }]
                    }
                ]}
                onPress={() => handlePress(item.route)}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons name={item.icon} size={24} color={item.iconColor} />
                    </View>
                    {isFullWidth && <Ionicons name="arrow-forward" size={24} color="#FFF" style={{ opacity: 0.8 }} />}
                </View>

                <View style={styles.cardContent}>
                    <StyledText style={styles.cardTitle}>{item.title}</StyledText>
                    <StyledText style={[styles.cardDesc, isFullWidth ? {} : { fontSize: 11, lineHeight: 14 }]} numberOfLines={2}>
                        {item.description}
                    </StyledText>
                    {isFullWidth && item.subtext && (
                        <StyledText style={[styles.cardDesc, { marginTop: 4, opacity: 0.9, fontSize: 13 }]}>{item.subtext}</StyledText>
                    )}
                </View>

                {/* Decorative circle/shape */}
                <View style={[styles.decorativeCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.PRIMARY_BACKGROUND }]} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <StyledText style={[styles.greeting, { color: colors.PRIMARY_TEXT, fontSize: 24, fontWeight: 'bold' }]}>
                        {t("welcome")}{username ? `, ${username}` : ''}
                    </StyledText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Full Width - Todo */}
                <View style={styles.row}>
                    {renderCard(features[0], width - (PADDING * 2), 160, true)}
                </View>

                {/* 2. Mosaic Row (Movies + Birthday/Shopping) */}
                <View style={styles.row}>
                    {/* Left Column - Movies (Tall) */}
                    <View style={{ width: COL_2_WIDTH }}>
                        {renderCard(features[1], COL_2_WIDTH, 260 + GAP)}
                    </View>

                    {/* Right Column - Stacked */}
                    <View style={{ width: COL_2_WIDTH, gap: GAP }}>
                        {renderCard(features[2], COL_2_WIDTH, 125)}
                        {renderCard(features[3], COL_2_WIDTH, 125)}
                    </View>
                </View>

                {/* 3. Bottom Row - Events, Expenses */}
                <View style={styles.row}>
                    {renderCard(features[4], COL_2_WIDTH, 130)}
                    {renderCard(features[5], COL_2_WIDTH, 130)}
                </View>

            </ScrollView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 16,
        marginBottom: 4,
    },
    scrollContent: {
        paddingHorizontal: PADDING,
        paddingBottom: 100,
        gap: GAP,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: GAP,
    },
    card: {
        borderRadius: 24,
        padding: 12,
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        zIndex: 2,
    },
    cardTitle: {
        fontSize: 16, // Slightly smaller for dense items
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 16,
    },
    decorativeCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        bottom: -20,
        right: -20,
        zIndex: 1,
    }
});
