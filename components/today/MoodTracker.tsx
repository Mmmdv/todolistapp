import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { resetMood, selectDayData, setMood } from '@/store/slices/todaySlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StyledText from '../StyledText';

const MOODS = [
    { id: 1, icon: 'sad-outline', label: 'mood_very_bad', color: '#A5B4FC' },
    { id: 2, icon: 'heart-dislike-outline', label: 'mood_bad', color: '#818CF8' },
    { id: 3, icon: 'happy-outline', label: 'mood_good', color: '#6366F1' },
    { id: 4, icon: 'heart-outline', label: 'mood_very_good', color: '#4F46E5' },
    { id: 5, icon: 'star-outline', label: 'mood_excellent', color: '#4338CA' },
];

export default function MoodTracker() {
    const { colors, t } = useTheme();
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const dayData: any = useSelector(selectDayData(today));
    const selectedMoodId = dayData?.mood;
    const selectedMoodDisplay = MOODS.find(m => m.id === selectedMoodId);

    // Get a deterministic random question based on logic (date)
    const questionCount = 7;
    const dateSeed = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
    const questionKey = `mood_q${(dateSeed % questionCount) + 1}` as any;

    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        if (selectedMoodId) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.4,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [selectedMoodId]);

    const handleSelect = (moodId: number) => {
        if (!selectedMoodId) {
            dispatch(setMood({ date: today, mood: moodId }));
        }
    };

    const handleReset = () => {
        dispatch(resetMood({ date: today }));
    };

    const getFeedback = () => {
        if (!selectedMoodId) return '';
        if (selectedMoodId <= 2) return t('mood_feedback_negative');
        if (selectedMoodId === 3) return t('mood_feedback_neutral');
        return t('mood_feedback_positive');
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16 }]}>
            {!selectedMoodId && (
                <StyledText style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT, marginBottom: 12 }]}>
                    {t(questionKey)}
                </StyledText>
            )}

            {selectedMoodId ? (
                <View style={styles.votedContainer}>
                    <StyledText style={[styles.votedText, { color: colors.PRIMARY_TEXT, textAlign: 'center' }]}>
                        {getFeedback()}
                    </StyledText>

                    <Animated.View style={[styles.waitingContainer, { opacity: fadeAnim }]}>
                        <View style={styles.loadingRow}>
                            <Ionicons name="people-outline" size={16} color={colors.PLACEHOLDER} style={{ marginRight: 6 }} />
                            <StyledText style={[styles.waitingTitle, { color: colors.PLACEHOLDER }]}>
                                {t('mood_voted')}
                            </StyledText>
                        </View>
                        <View style={styles.clockRow}>
                            <Ionicons name="time-outline" size={12} color={colors.PLACEHOLDER} style={{ marginRight: 4, opacity: 0.7 }} />
                            <StyledText style={[styles.unlockText, { color: colors.PLACEHOLDER, opacity: 0.7 }]}>
                                {t('mood_unlock_time')}
                            </StyledText>
                        </View>
                    </Animated.View>

                    <TouchableOpacity
                        onPress={handleReset}
                        style={styles.resetButton}
                    >
                        <StyledText style={{ color: colors.PLACEHOLDER, fontSize: 10, textDecorationLine: 'underline' }}>
                            Test: Sıfırla
                        </StyledText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.moodsRow}>
                    {MOODS.map((mood) => (
                        <Pressable
                            key={mood.id}
                            onPress={() => handleSelect(mood.id)}
                            style={({ pressed }) => [
                                styles.moodButton,
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                        >
                            <Ionicons name={mood.icon as any} size={32} color={mood.color} />
                            <StyledText style={[styles.moodLabel, { color: colors.PLACEHOLDER }]}>
                                {t(mood.label as any)}
                            </StyledText>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    moodsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moodButton: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    moodLabel: {
        fontSize: 10,
        textAlign: 'center',
    },
    votedContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    votedText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    waitingContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150, 150, 150, 0.1)',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    waitingTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    unlockText: {
        fontSize: 12,
    },
    clockRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resetButton: {
        marginTop: 15,
        padding: 5,
    }
});
