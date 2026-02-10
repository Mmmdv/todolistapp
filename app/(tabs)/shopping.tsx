import ComingSoon from "@/components/ComingSoon";
import { useTheme } from "@/hooks/useTheme";
import Header from "@/layout/Header";
import { View } from "react-native";

export default function Shopping() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.PRIMARY_BACKGROUND }}>
            <Header />
            <ComingSoon />
        </View>
    );
}
