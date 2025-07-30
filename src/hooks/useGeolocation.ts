import { useState } from 'react';
import type { GeolocationOptions } from '../types/geolocation';
import { reverseGeocode } from '../utils/naverMapUtils';

// 내부 헬퍼 함수들
const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5분간 캐시된 위치 사용
};

const checkGeolocationSupport = (): boolean => {
    return 'geolocation' in navigator;
};

const checkGeolocationPermission = async (): Promise<PermissionState | null> => {
    if (!('permissions' in navigator)) {
        return null;
    }
    
    try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
    } catch (error) {
        console.log('Permission API not supported');
        return null;
    }
};

const getCurrentPosition = (options?: GeolocationOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!checkGeolocationSupport()) {
            reject(new Error('현재 위치 기능을 지원하지 않는 브라우저입니다.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { ...defaultOptions, ...options }
        );
    });
};

const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return '위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
        case error.POSITION_UNAVAILABLE:
            return '현재 위치 정보를 사용할 수 없습니다.';
        case error.TIMEOUT:
            return '위치 정보를 가져오는데 시간이 초과되었습니다.';
        default:
            return '위치 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.';
    }
};

export const useGeolocation = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentLocationAddress = async (): Promise<string> => {
        setError(null);
        
        // 권한 상태 확인
        const permission = await checkGeolocationPermission();
        if (permission === 'denied') {
            const errorMsg = '위치 권한이 차단되어 있습니다. 브라우저 주소창의 자물쇠 아이콘을 클릭하여 위치 권한을 허용해주세요.';
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        setLoading(true);

        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            console.log('현재 좌표:', { latitude, longitude });

            // 네이버 지도 API로 실제 주소 변환
            const latlng = new naver.maps.LatLng(latitude, longitude);
            const address = await reverseGeocode(latlng);
            return address;
        } catch (error) {
            console.error('위치 가져오기 오류:', error);

            let errorMessage: string;
            if (error instanceof GeolocationPositionError) {
                errorMessage = getGeolocationErrorMessage(error);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = '위치 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.';
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getCurrentLocationAddress
    };
};