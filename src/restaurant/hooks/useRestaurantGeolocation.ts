import { useState } from "react";

interface Location {
    lat: number;
    lng: number;
}

export const useRestaurantGeolocation = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const getCurrentLocation = (): Promise<Location> => {
        setLoading(true);

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                setLoading(false);
                reject(new Error("위치 정보가 지원되지 않는 브라우저입니다."));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setLoading(false);
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err: GeolocationPositionError) => {
                    setLoading(false);
                    reject(err);
                }
            );
        });
    };

    return { loading, getCurrentLocation };
};
