import CustomSwitch from "@/components/CustomSwitch";
import StyledText from "@/components/StyledText";
import { useLocation } from "@/hooks/useLocation";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/store";
import { updateAppSetting } from "@/store/slices/appSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { styles } from "../styles";

const LocationSection: React.FC = () => {
    const { colors, t, locationEnabled } = useTheme();
    const { city } = useLocation();
    const dispatch = useAppDispatch();

    const handleLocationToggle = (value: boolean) => {
        dispatch(updateAppSetting({ locationEnabled: value }));
    };

    return (
        <View style={styles.section}>
            <StyledText style={[styles.sectionTitle, { color: colors.PRIMARY_TEXT }]}>{t("location_services")}</StyledText>
            <View style={styles.aboutContainer}>
                <View style={[styles.aboutRow, { borderColor: colors.PRIMARY_BORDER_DARK, borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="location" size={20} color={locationEnabled ? colors.CHECKBOX_SUCCESS : "#888"} />
                        <View style={{ flex: 1 }}>
                            <StyledText style={[styles.aboutLabel, { color: colors.PRIMARY_TEXT }]}>{t("location_services")}</StyledText>
                            <StyledText style={{ fontSize: 11, color: colors.PLACEHOLDER }}>{t("location_services_desc")}</StyledText>
                            {locationEnabled && city && (
                                <StyledText style={{ fontSize: 11, color: colors.CHECKBOX_SUCCESS, marginTop: 2 }}>
                                    {t("current_location") || "Mövcud məkan"}: {city}
                                </StyledText>
                            )}
                        </View>
                    </View>
                    <CustomSwitch
                        onValueChange={handleLocationToggle}
                        value={locationEnabled ?? false}
                    />
                </View>
            </View>
        </View>
    );
};

export default LocationSection;
