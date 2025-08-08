// // 네이버 지도 API 타입 정의
//
// export interface NaverMapsOptions {
//     center: naver.maps.LatLng;
//     zoom: number;
//     mapTypeControl?: boolean;
//     zoomControl?: boolean;
//     logoControl?: boolean;
//     scaleControl?: boolean;
// }
//
// export interface NaverMarkerOptions {
//     position: naver.maps.LatLng;
//     map: naver.maps.Map | null;
//     icon?: {
//         content: string;
//         anchor: naver.maps.Point;
//     };
// }
//
// declare global {
//     namespace naver {
//         namespace maps {
//             class Map {
//                 constructor(element: string | HTMLElement, options: NaverMapsOptions);
//
//                 setCenter(latlng: LatLng): void;
//
//                 setZoom(zoom: number): void;
//
//                 fitBounds(bounds: LatLngBounds, options?: { padding: number }): void;
//
//                 getZoom(): number;
//             }
//
//             class LatLng {
//                 constructor(lat: number, lng: number);
//
//                 lat(): number;
//
//                 lng(): number;
//             }
//
//             class LatLngBounds {
//                 constructor();
//
//                 extend(latlng: LatLng): void;
//             }
//
//             class Marker {
//                 constructor(options: NaverMarkerOptions);
//
//                 setMap(map: Map | null): void;
//
//                 getElement(): HTMLElement | null;
//             }
//
//             class Point {
//                 constructor(x: number, y: number);
//             }
//
//             namespace Event {
//                 function addListener(target: unknown, type: string, listener: (...args: unknown[]) => void): unknown;
//             }
//         }
//     }
// }
//
// export {};