// import {apiClient} from '../Api.tsx';
// import type {BackendAddressSearchResponse} from '../../../types/api';
//
// export const naverApi = {
//     // Address search using backend API
//     searchAddress: async (query: string): Promise<BackendAddressSearchResponse> => {
//         try {
//             const response = await apiClient.get<BackendAddressSearchResponse>('/naver-maps/search', {
//                 params: {query}
//             });
//             return response.data;
//         } catch (error) {
//             console.error('주소 검색 실패:', error);
//             throw error;
//         }
//     },
//
//
//     // Center point calculation
//     calculateCenterPoint: async (locations: Array<{ lat: number, lng: number }>): Promise<{
//         lat: number,
//         lng: number,
//         count: number
//     }> => {
//         try {
//             const response = await apiClient.post('/naver-maps/center-point', locations);
//             return response.data;
//         } catch (error) {
//             console.error('중심점 계산 실패:', error);
//             throw error;
//         }
//     },
//
//     // Reverse geocoding
//     reverseGeocode: async (lat: number, lng: number): Promise<BackendAddressSearchResponse> => {
//         try {
//             const response = await apiClient.get<BackendAddressSearchResponse>('/naver-maps/reverse-geocode', {
//                 params: {lat, lng}
//             });
//             return response.data;
//         } catch (error) {
//             console.error('리버스 지오코딩 실패:', error);
//             throw error;
//         }
//     },
// };