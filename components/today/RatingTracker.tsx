import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { selectDayData, setRating } from '@/store/slices/todaySlice';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StyledText from '../StyledText';

export default function RatingTracker() {
    const { colors, t } = useTheme();
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const dayData: any = useSelector(selectDayData(today));
    const currentRating = dayData?.rating;

    const handleSelect = (rating: number) => {
        dispatch(setRating({ date: today, rating }));
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16, height: 160 }]}>
            <View style={homeStyles.cardHeader}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#F59E0B' }]}>
                    <Ionicons name="star" size={20} color="#FFF" />
                </View>
            </View>

            <View style={{ marginTop: 8 }}>
                <StyledText style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT }]} numberOfLines={1}>
                    {t('today_rating')}
                </StyledText>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.ratingRow}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <Pressable
                            key={num}
                            onPress={() => handleSelect(num)}
                            style={({ pressed }) => [
                                styles.ratingButton,
                                {
                                    backgroundColor: currentRating === num ? '#F59E0B' : colors.PRIMARY_BACKGROUND,
                                    borderColor: colors.PRIMARY_BORDER,
                                    opacity: pressed ? 0.7 : 1
                                }
                            ]}
                        >
                            <StyledText style={{
                                color: currentRating === num ? '#FFF' : colors.PRIMARY_TEXT,
                                fontWeight: 'bold'
                            }}>
                                {num}
                            </StyledText>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View style={[homeStyles.decorativeCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    ratingRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingBottom: 4,
    },
    ratingButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
