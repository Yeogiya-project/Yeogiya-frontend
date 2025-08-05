import {apiClient} from '../Api.tsx';
import type {KakaoBackendReverseGeocodingResponse, KakaoBackendSearchResponse, MeetingPlaceRequest, MeetingPlaceResponse} from '../../../types/api';

export const kakaoApi = {
    searchPlaces: async (
        query: string,
        searchType: 'KEYWORD' | 'CATEGORY' = 'KEYWORD',
        options?: {
            categoryGroupCode?: string;
            x?: number;
            y?: number;
            radius?: number;
            rect?: string;
            page?: number;
            size?: number;
            sort?: string;
        }
    ): Promise<KakaoBackendSearchResponse> => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.append('query', query);
            searchParams.append('searchType', searchType);

            if (options) {
                Object.entries(options).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        searchParams.append(key, value.toString());
                    }
                });
            }

            const url = `/kakao-maps/search?${searchParams.toString()}`;
            console.log('요청 URL:', url); // 디버깅용

            const response = await apiClient.get<KakaoBackendSearchResponse>(url);
            return response;
        } catch (error) {
            console.error('주소 검색 실패:', error);
            throw error;
        }
    },

    reverseGeocoding: async (
        x: string,
        y: string,
        inputCoord?: string
    ): Promise<KakaoBackendReverseGeocodingResponse> => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.append('x', x);
            searchParams.append('y', y);
            if (inputCoord) {
                searchParams.append('input_coord', inputCoord);
            }

            const url = `/kakao-maps/reverse-geocoding?${searchParams.toString()}`;
            console.log('요청 URL:', url); // 디버깅용

            const response = await apiClient.get<KakaoBackendReverseGeocodingResponse>(url);
            return response;
        } catch (error) {
            console.error('주소 검색 실패:', error);
            throw error;
        }
    },

    findMeetingPlace: async (request: MeetingPlaceRequest): Promise<MeetingPlaceResponse> => {
        try {
            const response = await apiClient.post<MeetingPlaceResponse>('/kakao-maps/meeting-place', request);
            return response;
        } catch (error) {
            console.error('중간지점 찾기 실패:', error);
            throw error;
        }
    },
};
