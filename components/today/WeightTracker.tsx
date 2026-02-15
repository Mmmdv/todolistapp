import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { selectDayData, setWeight } from '@/store/slices/todaySlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StyledText from '../StyledText';

export default function WeightTracker() {
    const { colors, t } = useTheme();
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const dayData: any = useSelector(selectDayData(today));
    const [inputValue, setInputValue] = useState(dayData?.weight?.toString() || '');

    const handleSave = () => {
        const weight = parseFloat(inputValue);
        if (!isNaN(weight)) {
            dispatch(setWeight({ date: today, weight }));
        }
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16, height: 160 }]}>
            <View style={homeStyles.cardHeader}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#10B981' }]}>
                    <Ionicons name="barbell-outline" size={20} color="#FFF" />
                </View>
            </View>

            <View style={{ marginTop: 8 }}>
                <StyledText style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT }]}>
                    {t('today_weight')}
                </StyledText>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.PRIMARY_TEXT, borderBottomColor: colors.PRIMARY_BORDER }]}
                        placeholder={t('weight_placeholder')}
                        placeholderTextColor={colors.PLACEHOLDER}
                        keyboardType="numeric"
                        value={inputValue}
                        onChangeText={setInputValue}
                        onBlur={handleSave}
                    />
                    <StyledText style={{ color: colors.PLACEHOLDER, marginLeft: 4 }}>kg</StyledText>
                </View>
            </View>

            <View style={[homeStyles.decorativeCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    input: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        minWidth: 60,
        padding: 4,
    }
});
