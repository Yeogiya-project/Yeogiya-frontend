import { useState } from 'react';
import { 
    checkGeolocationPermission, 
    getCurrentPosition, 
    getGeolocationErrorMessage 
} from '../utils/geolocation';
// import { reverseGeocode } from '../utils/api/api'; // 추후 API 함수 import

export const useGeolocation = () => {
    const [gettingLocation, setGettingLocation] = useState<boolean>(false);

    const getCurrentLocationAddress = async (): Promise<string> => {
        // 권한 상태 확인
        const permission = await checkGeolocationPermission();
        if (permission === 'denied') {
            throw new Error('위치 권한이 차단되어 있습니다. 브라우저 주소창의 자물쇠 아이콘을 클릭하여 위치 권한을 허용해주세요.');
        }

        setGettingLocation(true);
        
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            console.log('현재 좌표:', { latitude, longitude });
            
            // TODO: API 함수 호출로 대체
            // const address = await reverseGeocode(longitude, latitude);
            
            // 임시 더미 데이터 (API 연결 전까지 사용)
            const address = `임시 주소 (위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)})`;
            return address;
        } catch (error) {
            console.error('위치 가져오기 오류:', error);
            
            if (error instanceof GeolocationPositionError) {
                throw new Error(getGeolocationErrorMessage(error));
            } else {
                throw error;
            }
        } finally {
            setGettingLocation(false);
        }
    };

    return {
        gettingLocation,
        getCurrentLocationAddress
    };
};