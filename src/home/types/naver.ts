// // 네이버 지오코딩 API 타입 정의
// export interface NaverGeocodeStatus {
//     OK: string;
//     ERROR: string;
// }
//
// export interface NaverGeocodeAddress {
//     roadAddress: string;
//     jibunAddress: string;
//     englishAddress: string;
//     x: string; // 경도
//     y: string; // 위도
//     distance: number;
// }
//
// export interface NaverGeocodeResponse {
//     v2: {
//         meta: {
//             totalCount: number;
//             page: number;
//             count: number;
//         };
//         addresses: NaverGeocodeAddress[];
//     };
// }
//
// export interface GeocodeResult {
//     lat: number;
//     lng: number;
//     roadAddress?: string;
//     jibunAddress?: string;
// }