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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 2 }}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#F59E0B' }]}>
                    <Ionicons name="star" size={20} color="#FFF" />
                </View>
                <StyledText
                    style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT, fontSize: 16, flex: 1, marginBottom: 0 }]}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                >
                    {t('today_rating')}
                </StyledText>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
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
                                fontWeight: 'bold',
                                fontSize: 16
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
        gap: 10,
        marginTop: 15,
        paddingBottom: 4,
    },
    ratingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
