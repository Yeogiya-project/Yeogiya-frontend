// // 실제로 사용되는 마커 및 지도 관련 함수들만 유지
//
// // 커스텀 마커 HTML 생성 함수
// const hexToRgba = (hex: string, alpha: number): string => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };
//
// const createCustomMarkerHTML = (name: string, emoji: string, color: string, isCenter: boolean = false): string => {
//     const centerAnimation = isCenter ? `
//         @keyframes centerPulse {
//             0% {
//                 transform: scale(1);
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(255, 71, 87, 0.7);
//             }
//             70% {
//                 transform: scale(1.1);
//                 box-shadow: 0 6px 16px rgba(0,0,0,0.4), 0 0 0 10px rgba(255, 71, 87, 0);
//             }
//             100% {
//                 transform: scale(1);
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(255, 71, 87, 0);
//             }
//         }
//     ` : '';
//
//     const markerAnimation = isCenter ? 'centerPulse 2s infinite' : 'bounce 2s infinite';
//
//     return `
//         <div style="
//             position: relative;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             cursor: pointer;
//             transform: translateY(-50%);
//         ">
//             <div style="
//                 width: ${isCenter ? '50px' : '40px'};
//                 height: ${isCenter ? '60px' : '50px'};
//                 background: linear-gradient(135deg, ${hexToRgba(color, 1)}, ${hexToRgba(color, 0.8)});
//                 border-radius: 20px 20px 20px 5px;
//                 border: 3px solid white;
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 position: relative;
//                 animation: ${markerAnimation};
//             ">
//                 <span style="
//                     font-size: ${isCenter ? '24px' : '20px'};
//                     filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
//                 ">${emoji}</span>
//             </div>
//             <div style="
//                 background: ${isCenter ?
//                     'linear-gradient(135deg, #ff6b6b, #ee5a24)' :
//                     'linear-gradient(135deg, #667eea, #764ba2)'};
//                 color: white;
//                 padding: ${isCenter ? '6px 12px' : '4px 8px'};
//                 border-radius: 12px;
//                 font-size: ${isCenter ? '14px' : '12px'};
//                 font-weight: bold;
//                 margin-top: 5px;
//                 box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//                 white-space: nowrap;
//                 border: 2px solid white;
//                 ${isCenter ? 'animation: sparkle 3s infinite;' : ''}
//             ">${name} ${isCenter ? '✨' : ''}</div>
//         </div>
//         <style>
//         @keyframes bounce {
//             0%, 20%, 50%, 80%, 100% {
//                 transform: translateY(-50%);
//             }
//             40% {
//                 transform: translateY(-55%);
//             }
//             60% {
//                 transform: translateY(-52%);
//             }
//         }
//         ${centerAnimation}
//         @keyframes sparkle {
//             0%, 100% {
//                 transform: scale(1);
//             }
//             50% {
//                 transform: scale(1.05);
//             }
//         }
//         </style>
//     `;
// };
//
// // 지도에 마커 추가 함수 (업그레이드 버전)
// export const createMarker = (
//     map: naver.maps.Map,
//     position: naver.maps.LatLng,
//     name: string,
//     type: 'friend' | 'center' | 'station' = 'friend',
//     friendIndex?: number
// ): naver.maps.Marker => {
//     let emoji: string;
//     let color: string;
//
//     if (type === 'center') {
//         emoji = '🎯';
//         color = '#ff4757'; // 빨간색
//     } else if (type === 'station') {
//         emoji = '🚇';
//         color = '#2ed573'; // 초록색
//     } else {
//         const friendEmojis = ['🙋‍♂️', '🙋‍♀️', '🤗', '😊', '🎉'];
//         const friendColors = ['#3742fa', '#ff6348', '#ffa502', '#a55eea', '#1e90ff'];
//
//         emoji = friendEmojis[friendIndex! % friendEmojis.length];
//         color = friendColors[friendIndex! % friendColors.length];
//     }
//
//     const isCenter = type === 'center';
//     const markerHTML = createCustomMarkerHTML(name, emoji, color, isCenter);
//
//     const marker = new naver.maps.Marker({
//         position: position,
//         map: map,
//         icon: {
//             content: markerHTML,
//             anchor: new naver.maps.Point(isCenter ? 25 : 20, isCenter ? 60 : 50)
//         }
//     });
//
//     naver.maps.Event.addListener(marker, 'click', function() {
//         const markerElement = marker.getElement();
//         if (markerElement) {
//             markerElement.style.animation = 'none';
//             setTimeout(() => {
//                 markerElement.style.animation = 'bounce 0.6s ease-in-out';
//             }, 10);
//         }
//     });
//
//     return marker;
// };
//
// // 여러 마커들이 모두 보이도록 지도 영역 조정
// export const fitMapToMarkers = (map: naver.maps.Map, positions: naver.maps.LatLng[]): void => {
//     if (positions.length === 0) return;
//
//     const bounds = new naver.maps.LatLngBounds();
//     positions.forEach(position => bounds.extend(position));
//
//     map.fitBounds(bounds, { padding: 50 });
// };
//
// // 모든 마커 제거
// export const clearMarkers = (markers: naver.maps.Marker[]): void => {
//     markers.forEach(marker => marker.setMap(null));
// };