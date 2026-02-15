import { useAppSelector } from '@/store';
import { selectAppSettings } from '@/store/slices/appSlice';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface LocationState {
    city: string | null;
    coords: {
        latitude: number;
        longitude: number;
    } | null;
    errorMsg: string | null;
    loading: boolean;
}

export const useLocation = () => {
    const { locationEnabled } = useAppSelector(selectAppSettings);
    const [location, setLocation] = useState<LocationState>({
        city: null,
        coords: null,
        errorMsg: null,
        loading: true,
    });

    useEffect(() => {
        if (!locationEnabled) {
            setLocation({
                city: null,
                coords: null,
                errorMsg: null,
                loading: false,
            });
            return;
        }

        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLocation(prev => ({
                        ...prev,
                        errorMsg: 'Permission to access location was denied',
                        loading: false,
                    }));
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = loc.coords;

                let reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });

                let city = 'Unknown';
                if (reverseGeocode.length > 0) {
                    city = reverseGeocode[0].city || reverseGeocode[0].region || reverseGeocode[0].district || 'Unknown';
                }

                setLocation({
                    city,
                    coords: { latitude, longitude },
                    errorMsg: null,
                    loading: false,
                });
            } catch (error: any) {
                setLocation(prev => ({
                    ...prev,
                    errorMsg: error.message || 'Failed to get location',
                    loading: false,
                }));
            }
        })();
    }, [locationEnabled]);

    return location;
};
