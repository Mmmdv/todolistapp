import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { resetRating, selectDayData, setRating } from '@/store/slices/todaySlice';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StyledText from '../StyledText';

export default function RatingTracker() {
    const { colors, t } = useTheme();
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const dayData: any = useSelector(selectDayData(today));
    const currentRating = dayData?.rating;

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const triggerHaptics = async (rating: number) => {
        try {
            if (rating >= 10) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else if (rating >= 8) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } else if (rating >= 5) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else if (rating >= 1) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
                await Haptics.selectionAsync();
            }
        } catch (error) {
            // Ignore haptics errors
        }
    };

    const getRatingTheme = (val: number) => {
        if (val <= 4) return { color: '#FF4757', label: 'mood_bad', icon: 'heart-dislike' };
        if (val <= 7) return { color: '#3B82F6', label: 'mood_q1', icon: 'thumbs-up' };
        if (val <= 9) return { color: '#10B981', label: 'mood_feedback_positive', icon: 'checkmark-circle' };
        return { color: '#F59E0B', label: 'mood_excellent', icon: 'trophy' };
    };

    const handleSelect = (rating: number) => {
        dispatch(setRating({ date: today, rating }));
        triggerHaptics(rating);

        // Animation sequence
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.8);

        if (rating <= 4) {
            // Shake effect for bad ratings
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }

        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true
            })
        ]).start();
    };

    const theme = currentRating ? getRatingTheme(currentRating) : null;

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16, minHeight: 140 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 10 }}>
                <View style={[styles.iconContainer, { backgroundColor: theme?.color || '#F59E0B' }]}>
                    <Ionicons name={(theme?.icon as any) || "star"} size={17} color="#FFF" />
                </View>
                <StyledText
                    style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT, fontSize: 14, flex: 1, marginBottom: 0 }]}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                >
                    {t('today_rating')}
                </StyledText>
                {currentRating && (
                    <Pressable
                        onPress={() => {
                            dispatch(resetRating({ date: today }));
                            fadeAnim.setValue(0);
                        }}
                        style={styles.headerButton}
                    >
                        <Ionicons name="refresh" size={16} color={colors.PLACEHOLDER} />
                    </Pressable>
                )}
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                {!currentRating ? (
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <Pressable
                                key={num}
                                onPress={() => handleSelect(num)}
                                style={({ pressed }) => [
                                    styles.ratingButton,
                                    {
                                        backgroundColor: colors.PRIMARY_BACKGROUND,
                                        borderColor: colors.PRIMARY_BORDER,
                                        opacity: pressed ? 0.7 : 1
                                    }
                                ]}
                            >
                                <StyledText style={{
                                    color: colors.PRIMARY_TEXT,
                                    fontWeight: 'bold',
                                    fontSize: 12
                                }}>
                                    {num}
                                </StyledText>
                            </Pressable>
                        ))}
                    </View>
                ) : (
                    <Animated.View
                        style={[
                            styles.selectedContainer,
                            {
                                transform: [
                                    { scale: scaleAnim },
                                    { translateX: shakeAnim }
                                ],
                                opacity: currentRating ? 1 : 0
                            }
                        ]}
                    >
                        <View style={styles.selectionMain}>
                            <StyledText style={[styles.selectedValue, { color: theme?.color || colors.PRIMARY_TEXT }]}>
                                {currentRating}
                            </StyledText>
                            <StyledText style={[styles.maxRating, { color: colors.PLACEHOLDER }]}>/ 10</StyledText>
                        </View>
                    </Animated.View>
                )}
            </View>

            <View
                style={[homeStyles.decorativeCircle, { backgroundColor: theme?.color ? `${theme.color}20` : 'rgba(245, 158, 11, 0.1)' }]}
                pointerEvents="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ratingRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 15,
    },
    ratingButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 26,
        height: 26,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        padding: 4,
    },
    selectedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionMain: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    selectedValue: {
        fontSize: 54,
        fontWeight: '900',
    },
    maxRating: {
        fontSize: 20,
        marginLeft: 4,
        fontWeight: '600',
        opacity: 0.5,
    },
    feedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: -5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    feedbackText: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
});
