import { styles as homeStyles } from '@/constants/homeStyles';
import { useTheme } from '@/hooks/useTheme';
import { resetWeight, selectDayData, selectLastWeight, setWeight } from '@/store/slices/todaySlice';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StyledText from '../StyledText';

const ITEM_WIDTH = 15; // Slightly wider for easier interaction
const START_WEIGHT = 40;
const END_WEIGHT = 180;

const WEIGHT_DATA = Array.from({ length: (END_WEIGHT - START_WEIGHT) * 10 + 1 }, (_, i) => ({
    value: parseFloat((START_WEIGHT + i * 0.1).toFixed(1)),
    isMajor: i % 10 === 0,
    isMedium: i % 5 === 0 && i % 10 !== 0
}));

export default function WeightTracker() {
    const { colors, t } = useTheme();
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];
    const dayData: any = useSelector(selectDayData(today));
    const lastWeight = useSelector(selectLastWeight);
    const flatListRef = useRef<FlatList>(null);

    const initialWeight = lastWeight || 70;
    const [localWeight, setLocalWeight] = useState<number>(dayData?.weight || initialWeight);
    const [containerWidth, setContainerWidth] = useState(0);

    const dayOfMonth = new Date().getDate();
    const questionIndex = (dayOfMonth % 5) + 1;
    const weightQuestionKey = `weight_q${questionIndex}` as const;

    const currentWeight = dayData?.weight;

    const scrollToWeight = (weight: number, animated = false) => {
        if (flatListRef.current && containerWidth > 0) {
            const index = WEIGHT_DATA.findIndex(d => d.value === weight);
            if (index !== -1) {
                flatListRef.current.scrollToOffset({
                    offset: index * ITEM_WIDTH,
                    animated
                });
            }
        }
    };

    useEffect(() => {
        if (!currentWeight && containerWidth > 0) {
            scrollToWeight(localWeight, false);
        }
    }, [containerWidth, currentWeight]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / ITEM_WIDTH);
        if (index >= 0 && index < WEIGHT_DATA.length) {
            const val = WEIGHT_DATA[index].value;
            if (val !== localWeight) {
                setLocalWeight(val);
            }
        }
    };

    const handleConfirm = () => {
        dispatch(setWeight({ date: today, weight: localWeight }));
    };

    const handleReset = () => {
        dispatch(resetWeight({ date: today }));
        const defaultWeight = lastWeight || 70;
        setLocalWeight(defaultWeight);
    };

    return (
        <View style={[homeStyles.card, { backgroundColor: colors.SECONDARY_BACKGROUND, padding: 16, height: 180 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 }}>
                <View style={[homeStyles.iconContainer, { backgroundColor: '#10B981' }]}>
                    <Ionicons name="barbell-outline" size={20} color="#FFF" />
                </View>
                <StyledText
                    style={[homeStyles.cardTitle, { color: colors.PRIMARY_TEXT, fontSize: 16, flex: 1, marginBottom: 0 }]}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                >
                    {currentWeight ? t('today_weight') : t(weightQuestionKey as any)}
                </StyledText>
                {currentWeight && (
                    <Pressable onPress={handleReset} style={styles.headerButton}>
                        <Ionicons name="refresh" size={18} color={colors.PLACEHOLDER} />
                    </Pressable>
                )}
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                {!currentWeight ? (
                    <View style={styles.contentContainer}>
                        {/* Enlarged Ruler Section */}
                        <View
                            style={styles.rulerContainer}
                            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                        >
                            <View style={[styles.pointer, { backgroundColor: '#10B981' }]} />
                            <FlatList
                                ref={flatListRef}
                                data={WEIGHT_DATA}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={ITEM_WIDTH}
                                decelerationRate="fast"
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                getItemLayout={(_, index) => ({
                                    length: ITEM_WIDTH,
                                    offset: ITEM_WIDTH * index,
                                    index,
                                })}
                                contentContainerStyle={{
                                    paddingHorizontal: containerWidth / 2,
                                }}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <View style={[styles.tickContainer, { width: ITEM_WIDTH }]}>
                                        <View
                                            style={[
                                                styles.tick,
                                                {
                                                    backgroundColor: colors.PRIMARY_BORDER,
                                                    height: item.isMajor ? 32 : item.isMedium ? 22 : 14,
                                                    width: item.isMajor ? 2.5 : 1.5,
                                                    opacity: item.isMajor ? 1 : 0.4
                                                }
                                            ]}
                                        />
                                        {item.isMajor && (
                                            <StyledText style={[styles.tickLabel, { color: colors.PLACEHOLDER }]}>
                                                {item.value}
                                            </StyledText>
                                        )}
                                    </View>
                                )}
                            />
                        </View>

                        {/* Confirm Button with Live Weight inside */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.confirmButton,
                                {
                                    backgroundColor: '#10B981',
                                    transform: [{ scale: pressed ? 0.96 : 1 }],
                                    opacity: pressed ? 0.9 : 1
                                }
                            ]}
                            onPress={handleConfirm}
                        >
                            <StyledText style={styles.buttonText}>
                                {localWeight.toFixed(1)} <StyledText style={styles.buttonUnit}>kg</StyledText>
                            </StyledText>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.selectedContainer}>
                        <StyledText style={[styles.selectedValue, { color: colors.PRIMARY_TEXT }]}>
                            {currentWeight}
                        </StyledText>
                        <StyledText style={[styles.unit, { color: colors.PLACEHOLDER }]}>kg</StyledText>
                    </View>
                )}
            </View>

            <View style={[homeStyles.decorativeCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 10,
    },
    rulerContainer: {
        height: 65,
        position: 'relative',
        justifyContent: 'center',
    },
    pointer: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 3.5,
        height: 45,
        zIndex: 10,
        borderRadius: 2,
        marginLeft: -1.75,
    },
    tickContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 60,
    },
    tick: {
        borderRadius: 1.5,
    },
    tickLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        paddingHorizontal: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
        marginBottom: 2,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonUnit: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    selectedContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
    },
    selectedValue: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: 24,
        marginLeft: 6,
        fontWeight: '600',
    },
    headerButton: {
        padding: 6,
    }
});
