import { styles as homeStyles } from '@/constants/homeStyles';
import { useLocation } from '@/hooks/useLocation';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import StyledText from '../StyledText';

export default function Weather() {
    const { colors, t } = useTheme();
    const { city, coords, loading: locationLoading, errorMsg } = useLocation();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (locationLoading) return;

        let query = 'Baku'; // Fallback
        if (coords) {
            query = `${coords.latitude},${coords.longitude}`;
        }

        setLoading(true);
        fetch(`https://wttr.in/${query}?format=j1`)
            .then(res => res.json())
            .then(data => {
                if (data && data.current_condition && data.current_condition[0]) {
                    setWeather(data.current_condition[0]);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [locationLoading, coords]);

    const getWeatherIcon = (desc: string) => {
        desc = desc.toLowerCase();
        if (desc.includes('sun') || desc.includes('clear')) return 'sunny-outline';
        if (desc.includes('cloud') || desc.includes('overcast')) return 'cloudy-outline';
        if (desc.includes('rain') || desc.includes('shower')) return 'rainy-outline';
        if (desc.includes('snow')) return 'snow-outline';
        if (desc.includes('mist') || desc.includes('fog')) return 'water-outline';
        return 'partly-sunny-outline';
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#06B6D4', marginRight: 10, width: 32, height: 32 }]}>
                    <Ionicons name="cloud" size={18} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                    <StyledText style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT }]}>
                        {city ? `${city} ${t('weather_current').toLowerCase()}` : t('weather_current')}
                    </StyledText>
                </View>
            </View>

            {loading || locationLoading ? (
                <ActivityIndicator color={colors.PRIMARY_TEXT} />
            ) : errorMsg ? (
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                    <Ionicons name="location-outline" size={32} color={colors.PLACEHOLDER} style={{ marginBottom: 8 }} />
                    <StyledText style={{ color: colors.PLACEHOLDER, fontSize: 12, textAlign: 'center' }}>
                        {t('location_error')}
                    </StyledText>
                </View>
            ) : weather ? (
                <View style={styles.weatherContainer}>
                    <View style={styles.mainInfo}>
                        <Ionicons
                            name={getWeatherIcon(weather.weatherDesc[0].value) as any}
                            size={48}
                            color="#F59E0B"
                        />
                        <View>
                            <StyledText style={[styles.temp, { color: colors.PRIMARY_TEXT }]}>
                                {weather.temp_C}°C
                            </StyledText>
                            <StyledText style={[styles.desc, { color: colors.PLACEHOLDER }]}>
                                {weather.weatherDesc[0].value}
                            </StyledText>
                        </View>
                    </View>

                    <View style={styles.details}>
                        <View style={styles.detailItem}>
                            <Ionicons name="water-outline" size={14} color={colors.PLACEHOLDER} />
                            <StyledText style={[styles.detailText, { color: colors.PLACEHOLDER }]}>
                                {weather.humidity}%
                            </StyledText>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="leaf-outline" size={14} color={colors.PLACEHOLDER} />
                            <StyledText style={[styles.detailText, { color: colors.PLACEHOLDER }]}>
                                {weather.windspeedKmph} km/h
                            </StyledText>
                        </View>
                    </View>
                </View>
            ) : (
                <StyledText style={{ color: colors.PLACEHOLDER }}>Weather info unavailable</StyledText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    weatherContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    temp: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 14,
    },
    details: {
        gap: 4,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
    }
});
