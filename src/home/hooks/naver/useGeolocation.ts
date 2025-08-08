// import {useState} from 'react';
//
// // 현재 위치를 가져오는 간단한 훅
// export const useGeolocation = () => {
//     const [loading, setLoading] = useState<boolean>(false);
//
//     // 현재 위치의 주소를 가져오는 함수
//     const getCurrentLocationAddress = async (): Promise<{ address: string; latitude: number; longitude: number }> => {
//         setLoading(true);
//
//         try {
//             // 1단계: 브라우저에서 현재 위치 좌표 가져오기
//             console.log('현재 위치 가져오는 중...');
//             const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//                 if (!navigator.geolocation) {
//                     reject(new Error('브라우저가 위치 서비스를 지원하지 않습니다.'));
//                     return;
//                 }
//
//                 navigator.geolocation.getCurrentPosition(
//                     (pos) => resolve(pos),
//                     () => reject(new Error('위치 권한을 허용해주세요.')),
//                     {
//                         enableHighAccuracy: true,  // 정확한 위치 사용
//                         timeout: 10000,           // 10초 제한
//                         maximumAge: 0             // 캐시 사용 안함
//                     }
//                 );
//             });
//
//             const {latitude, longitude} = position.coords;
//             console.log('위치 좌표:', latitude, longitude);
//
//             // 2단계: 네이버 지도 SDK로 좌표를 주소로 변환
//             const address = await new Promise<string>((resolve) => {
//                 if (window.naver?.maps?.Service) {
//                     console.log('네이버 SDK로 역지오코딩 시작...');
//                     window.naver.maps.Service.reverseGeocode({
//                         coords: new window.naver.maps.LatLng(latitude, longitude),
//                         orders: [
//                             window.naver.maps.Service.OrderType.ROAD_ADDR,
//                             window.naver.maps.Service.OrderType.ADDR
//                         ].join(',')
//                     }, (status: any, response: any) => {
//                         console.log('역지오코딩 상태:', status);
//                         console.log('역지오코딩 응답:', response);
//
//                         if (status === window.naver.maps.Service.Status.OK && response.v2?.results?.length > 0) {
//                             resolve(response.v2.address.jibunAddress);
//                         } else {
//                             console.log('주소 변환 실패');
//                         }
//                     });
//                 } else {
//                     console.log('네이버 지도 SDK 없음');
//                 }
//             });
//
//             console.log('변환된 주소:', address);
//             return {address, latitude, longitude};
//
//         } catch (error) {
//             console.error('위치 가져오기 실패:', error);
//             throw new Error(error instanceof Error ? error.message : '현재 위치를 가져올 수 없습니다.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return {
//         loading,
//         getCurrentLocationAddress
//     };
// };