import { useCallback } from 'react';
import type { AddressResult } from '../types/home';
import type { NaverGeocodeResponse } from '../types/naver';

export const useNaverGeocode = () => {
    // 지오코딩: 주소 → 좌표 변환
    const geocodeAddress = useCallback((query: string): Promise<AddressResult[]> => {
        return new Promise((resolve) => {
            naver.maps.Service.geocode({
                query
            }, (status: any, response: NaverGeocodeResponse) => {
                if (status === naver.maps.Service.Status.OK && response.v2.addresses?.length > 0) {
                    const results: AddressResult[] = response.v2.addresses.map((item, index) => ({
                        title: item.roadAddress || item.jibunAddress || `주소 ${index + 1}`,
                        category: '주소',
                        address: item.jibunAddress || '',
                        roadAddress: item.roadAddress || '',
                        mapX: item.x,
                        mapY: item.y
                    }));
                    resolve(results);
                } else {
                    resolve([]);
                }
            });
        });
    }, []);

    // 좌표 → 주소 변환 (기존 useModal에서 사용하던 로직)
    const reverseGeocode = useCallback((lat: number, lng: number): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve) => {
            naver.maps.Service.geocode({
                query: `${lat},${lng}`
            }, (status: any, response: NaverGeocodeResponse) => {
                if (status === naver.maps.Service.Status.OK && response.v2.addresses?.length > 0) {
                    const address = response.v2.addresses[0];
                    resolve({
                        lat: parseFloat(address.y),
                        lng: parseFloat(address.x)
                    });
                } else {
                    resolve({ lat, lng });
                }
            });
        });
    }, []);

    return {
        geocodeAddress,
        reverseGeocode
    };
};