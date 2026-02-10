import { LayoutAnimation } from "react-native"

export const toggleAnimation = {
    duration: 700,
    create: {
        duration: 700,
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
    },
    update: {
        duration: 700,
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
    },
    delete: {
        duration: 500,
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
    },
}
