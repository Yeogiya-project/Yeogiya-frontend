import { kakaoApi } from "../../utils/kakao/KakaoApi.tsx";

export const useGeolocation = () => {
    const getCurrentLocationAddress = async (): Promise<{
        latitude: number;
        longitude: number;
        address: string;
        roadAddress?: string;
    }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude, accuracy } = position.coords;
                        
                        // GPS 정확도가 너무 낮으면 경고
                        if (accuracy > 1000) {
                            console.warn(`GPS 정확도가 낮습니다: ${Math.round(accuracy)}m`);
                        }
                        
                        // 카카오 reverseGeocoding으로 주소 변환
                        const geocodeResult = await kakaoApi.reverseGeocoding(
                            longitude.toString(), // 카카오는 x가 경도
                            latitude.toString()   // 카카오는 y가 위도
                        );

                        if (geocodeResult.documents && geocodeResult.documents.length > 0) {
                            const address = geocodeResult.documents[0];
                            resolve({
                                latitude,
                                longitude,
                                address: address.address?.address_name || '',
                                roadAddress: address.roadAddress?.address_name || undefined
                            });
                        } else {
                            reject(new Error('주소를 찾을 수 없습니다.'));
                        }
                    } catch (error) {
                        console.error('Reverse geocoding 실패:', error);
                        reject(new Error('주소 변환에 실패했습니다.'));
                    }
                },
                (error) => {
                    let errorMessage = '위치를 가져올 수 없습니다.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '위치 정보를 사용할 수 없습니다.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '위치 요청 시간이 초과되었습니다.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 60000  // 1분으로 줄임 (더 자주 새로운 위치 요청)
                }
            );
        });
    };

    return {
        getCurrentLocationAddress
    };
};