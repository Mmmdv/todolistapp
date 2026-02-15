import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import StyledText from '../StyledText';

const CURRENCIES = [
    { code: 'USD', icon: 'logo-usd', color: '#10B981' },
    { code: 'EUR', icon: 'logo-euro', color: '#3B82F6' },
    { code: 'TRY', icon: 'cash-outline', color: '#EF4444' },
    { code: 'RUB', icon: 'cash-outline', color: '#8B5CF6' },
];

export default function CurrencyRates() {
    const { colors, t } = useTheme();
    const [rates, setRates] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/AZN')
            .then(res => res.json())
            .then(data => {
                setRates(data.rates);
                setLoading(false);
            })
            .catch(() => {
                // Fallback mock values approximately
                setRates({ USD: 0.5882, EUR: 0.5435, TRY: 18.05, RUB: 54.34 });
                setLoading(false);
            });
    }, []);

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#4F46E5', marginRight: 10, width: 32, height: 32 }]}>
                    <Ionicons name="trending-up" size={18} color="#FFF" />
                </View>
                <StyledText style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT }]}>
                    {t('currency_rates')} (1 AZN)
                </StyledText>
            </View>

            {loading ? (
                <ActivityIndicator color={colors.PRIMARY_TEXT} />
            ) : (
                <View style={styles.ratesGrid}>
                    {CURRENCIES.map((curr) => (
                        <View key={curr.code} style={styles.rateItem}>
                            <View style={[styles.currIcon, { backgroundColor: curr.color + '20' }]}>
                                <Ionicons name={curr.icon as any} size={16} color={curr.color} />
                            </View>
                            <View>
                                <StyledText style={[styles.currCode, { color: colors.PRIMARY_TEXT }]}>{curr.code}</StyledText>
                                <StyledText style={[styles.currValue, { color: colors.PLACEHOLDER }]}>
                                    {rates[curr.code]?.toFixed(4)}
                                </StyledText>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    ratesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    rateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%',
        gap: 8,
    },
    currIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currCode: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    currValue: {
        fontSize: 12,
    }
});
