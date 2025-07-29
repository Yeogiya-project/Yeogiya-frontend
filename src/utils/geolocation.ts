// Geolocation 관련 유틸리티 함수들

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

export const defaultGeolocationOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5분간 캐시된 위치 사용
};

export const checkGeolocationSupport = (): boolean => {
    return 'geolocation' in navigator;
};

export const checkGeolocationPermission = async (): Promise<PermissionState | null> => {
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

export const getCurrentPosition = (options?: GeolocationOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!checkGeolocationSupport()) {
            reject({
                code: 0,
                message: '현재 위치 기능을 지원하지 않는 브라우저입니다.'
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { ...defaultGeolocationOptions, ...options }
        );
    });
};

export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
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