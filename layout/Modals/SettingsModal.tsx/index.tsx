import StyledText from "@/components/StyledText";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/store";
import { Lang, Theme, updateAppSetting } from "@/store/slices/appSlice";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { Image, Linking, Modal, Platform, StyleSheet, Switch, TouchableOpacity, View } from "react-native";

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const { colors, t, lang, theme, notificationsEnabled } = useTheme();
    const dispatch = useAppDispatch();

    const handleLanguageChange = (newLang: Lang) => {
        dispatch(updateAppSetting({ lang: newLang }));
    };

    const handleThemeChange = (newTheme: Theme) => {
        dispatch(updateAppSetting({ theme: newTheme }));
    };

    const handleNotificationToggle = (value: boolean) => {
        dispatch(updateAppSetting({ notificationsEnabled: value }));
    };

    const handleRateUs = () => {
        const storeUrl = Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/id6443574936' // Placeholder ID
            : 'https://play.google.com/store/apps/details?id=com.mmmdv.todolistapp'; // Based on package name or placeholder
        Linking.openURL(storeUrl).catch(err => console.error("An error occurred", err));
    };

    const appVersion = Constants.expoConfig?.version ?? '1.0.0';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.SECONDARY_BACKGROUND, borderColor: colors.PRIMARY_BORDER_DARK }]}>
                    <View style={styles.header}>
                        <StyledText style={[styles.title, { color: colors.PRIMARY_TEXT }]}>
                            {t("settings")}
                        </StyledText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={colors.PRIMARY_TEXT} />
                        </TouchableOpacity>
                    </View>

                    {/* Language Section */}
                    <View style={styles.section}>
                        <StyledText style={[styles.sectionTitle, { color: colors.PRIMARY_TEXT }]}>{t("select_language")}</StyledText>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    lang === Lang.AZ && { backgroundColor: colors.PRIMARY_ACTIVE_BUTTON },
                                    { borderColor: colors.PRIMARY_BORDER_DARK }
                                ]}
                                onPress={() => handleLanguageChange(Lang.AZ)}
                            >
                                <StyledText style={[
                                    styles.optionText,
                                    { color: lang === Lang.AZ ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT }
                                ]}>
                                    AZ
                                </StyledText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    lang === Lang.EN && { backgroundColor: colors.PRIMARY_ACTIVE_BUTTON },
                                    { borderColor: colors.PRIMARY_BORDER_DARK }
                                ]}
                                onPress={() => handleLanguageChange(Lang.EN)}
                            >
                                <StyledText style={[
                                    styles.optionText,
                                    { color: lang === Lang.EN ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT }
                                ]}>
                                    ENG
                                </StyledText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    lang === Lang.RU && { backgroundColor: colors.PRIMARY_ACTIVE_BUTTON },
                                    { borderColor: colors.PRIMARY_BORDER_DARK }
                                ]}
                                onPress={() => handleLanguageChange(Lang.RU)}
                            >
                                <StyledText style={[
                                    styles.optionText,
                                    { color: lang === Lang.RU ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT }
                                ]}>
                                    RU
                                </StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Theme Section */}
                    <View style={styles.section}>
                        <StyledText style={[styles.sectionTitle, { color: colors.PRIMARY_TEXT }]}>{t("select_theme")}</StyledText>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    theme === Theme.DARK && { backgroundColor: colors.PRIMARY_ACTIVE_BUTTON },
                                    { borderColor: colors.PRIMARY_BORDER_DARK }
                                ]}
                                onPress={() => handleThemeChange(Theme.DARK)}
                            >
                                <Ionicons name="moon" size={18} color={theme === Theme.DARK ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT} style={{ marginRight: 8 }} />
                                <StyledText style={[
                                    styles.optionText,
                                    { color: theme === Theme.DARK ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT }
                                ]}>
                                    {t("dark")}
                                </StyledText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    theme === Theme.LIGHT && { backgroundColor: colors.PRIMARY_ACTIVE_BUTTON },
                                    { borderColor: colors.PRIMARY_BORDER_DARK }
                                ]}
                                onPress={() => handleThemeChange(Theme.LIGHT)}
                            >
                                <Ionicons name="sunny" size={18} color={theme === Theme.LIGHT ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT} style={{ marginRight: 8 }} />
                                <StyledText style={[
                                    styles.optionText,
                                    { color: theme === Theme.LIGHT ? colors.PRIMARY_ACTIVE_BUTTON_TEXT : colors.PRIMARY_TEXT }
                                ]}>
                                    {t("light")}
                                </StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Notifications Section */}
                    <View style={styles.section}>
                        <StyledText style={[styles.sectionTitle, { color: colors.PRIMARY_TEXT }]}>{t("notifications")}</StyledText>
                        <View style={styles.aboutContainer}>
                            <View style={[styles.aboutRow, { borderColor: colors.PRIMARY_BORDER_DARK, borderBottomWidth: 0 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Ionicons name="notifications" size={20} color={notificationsEnabled ? colors.CHECKBOX_SUCCESS : "#888"} />
                                    <StyledText style={[styles.aboutLabel, { color: colors.PRIMARY_TEXT }]}>{t("enable_notifications")}</StyledText>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: colors.CHECKBOX_SUCCESS }}
                                    thumbColor={"#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={handleNotificationToggle}
                                    value={notificationsEnabled ?? true}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.PRIMARY_BORDER_DARK }]} />

                    {/* Application Section */}
                    <View style={styles.section}>
                        <StyledText style={[styles.sectionTitle, { color: colors.PRIMARY_TEXT }]}>{t("application")}</StyledText>
                        <View style={styles.aboutContainer}>
                            <View style={[styles.aboutRow, { borderColor: colors.PRIMARY_BORDER_DARK, borderBottomWidth: 0 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <Image
                                        source={require("@/assets/images/nar_4_1_1.png")}
                                        style={{ width: 40, height: 40, borderRadius: 8 }}
                                    />
                                    <View>
                                        <StyledText style={{ fontSize: 16, fontWeight: '600', color: colors.PRIMARY_TEXT }}>{t("version")}</StyledText>
                                        <StyledText style={{ fontSize: 13, color: colors.PLACEHOLDER }}>v{appVersion}</StyledText>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.aboutRow, { borderColor: colors.PRIMARY_BORDER_DARK, borderBottomWidth: 0 }]}
                                onPress={handleRateUs}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Ionicons name="star" size={20} color="#888" />
                                    <StyledText style={[styles.aboutLabel, { color: colors.PRIMARY_TEXT }]}>{t("rate_us")}</StyledText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.PLACEHOLDER} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 20,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 20,
        opacity: 0.5,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        opacity: 0.8,
    },
    optionsContainer: {
        flexDirection: "row",
        gap: 10,
    },
    optionButton: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        fontWeight: "600",
    },
    aboutContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
    },
    aboutLabel: {
        fontSize: 16,
    },
    aboutValue: {
        fontSize: 16,
        opacity: 0.7,
    },
});

export default SettingsModal;
