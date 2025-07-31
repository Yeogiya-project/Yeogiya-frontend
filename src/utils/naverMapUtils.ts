import type { 
    NaverReverseGeocodeResult, 
    NaverGeocodeResponse
} from '../types/geolocation';
import type { NaverSearchResult, NaverServiceCallback } from '../types/naver-maps';

// 네이버 지도 API 헬퍼 함수들
export const hasArea = (area: { name?: string }): boolean => {
    return !!(area && area.name && area.name !== '');
};

export const hasData = (data: string | undefined | null): boolean => {
    return !!(data && data !== '');
};

export const checkLastString = (word: string, lastString: string): boolean => {
    return new RegExp(lastString + '$').test(word);
};

export const hasAddition = (addition: { value?: string } | undefined): boolean => {
    return !!(addition && addition.value);
};

// 주소 생성 함수 (원본 코드의 makeAddress 함수)
export const makeAddress = (item: NaverReverseGeocodeResult): string => {
    if (!item) {
        return '';
    }

    const name = item.name;
    const region = item.region;
    const land = item.land;
    const isRoadAddress = name === 'roadaddr';

    let sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

    if (hasArea(region.area1)) {
        sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === '2') {
                rest += '산';
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += ('-' + land.number2);
            }
        }

        if (isRoadAddress) {
            if (checkLastString(dongmyun, '면')) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = '';
            }

            if (hasAddition(land.addition0)) {
                rest += ' ' + land.addition0!.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(' ').trim();
};

// 네이버 지도 Service 래퍼 함수들
export const reverseGeocode = (latlng: naver.maps.LatLng): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!window.naver?.maps?.Service) {
            reject(new Error('네이버 지도 API가 로드되지 않았습니다.'));
            return;
        }

        const callback: NaverServiceCallback = (status, response) => {
            if (status === naver.maps.Service.Status.ERROR) {
                reject(new Error('주소 검색에 실패했습니다.'));
                return;
            }

            const naverResponse = response as { v2: { results: NaverReverseGeocodeResult[] } };
            const items = naverResponse.v2.results;
            if (!items || items.length === 0) {
                reject(new Error('주소를 찾을 수 없습니다.'));
                return;
            }

            // 도로명 주소 우선
            const roadItem = items.find((item: NaverReverseGeocodeResult) => item.name === 'roadaddr');
            const addressItem = roadItem || items[0];
            
            const address = makeAddress(addressItem);
            if (!address) {
                reject(new Error('주소를 생성할 수 없습니다.'));
                return;
            }

            resolve(address);
        };

        naver.maps.Service.reverseGeocode({
            coords: latlng,
            orders: [
                naver.maps.Service.OrderType.ADDR,
                naver.maps.Service.OrderType.ROAD_ADDR
            ].join(',')
        }, callback);
    });
};

export const geocode = (address: string): Promise<NaverGeocodeResponse> => {
    return new Promise((resolve, reject) => {
        if (!window.naver?.maps?.Service) {
            reject(new Error('네이버 지도 API가 로드되지 않았습니다.'));
            return;
        }

        const callback: NaverServiceCallback = (status, response) => {
            if (status === naver.maps.Service.Status.ERROR) {
                reject(new Error('주소 검색에 실패했습니다.'));
                return;
            }

            const geocodeResponse = response as NaverGeocodeResponse;
            if (geocodeResponse.v2.meta.totalCount === 0) {
                reject(new Error('검색 결과가 없습니다.'));
                return;
            }

            resolve(geocodeResponse);
        };

        naver.maps.Service.geocode({
            query: address
        }, callback);
    });
};

// 네이버 Local Search API를 사용한 장소 검색 (POI, 지명 등)
export const searchPlaces = (query: string, options?: { location?: naver.maps.LatLng, radius?: number, sort?: string }): Promise<NaverSearchResult> => {
    return new Promise((resolve, reject) => {
        if (!window.naver?.maps?.Service || !window.naver.maps.Service.SearchType || !window.naver.maps.Service.SearchType.PLACE) {
            reject(new Error('네이버 지도 API 또는 SearchType.PLACE가 로드되지 않았습니다.'));
            return;
        }

        const callback: NaverServiceCallback<NaverSearchResult> = (status, response) => {
            if (status === naver.maps.Service.Status.ERROR) {
                reject(new Error('장소 검색에 실패했습니다.'));
                return;
            }

            if (!response.result || response.result.total === 0) {
                reject(new Error('검색 결과가 없습니다.'));
                return;
            }

            resolve(response);
        };

        naver.maps.Service.search({
            query: query,
            type: naver.maps.Service.SearchType.PLACE,
            ...options
        }, callback);
    });
};

// 주변 지하철역 검색 함수
export const searchNearbySubwayStations = async (location: naver.maps.LatLng): Promise<NaverSearchResult | null> => {
    try {
        const response = await searchPlaces('지하철역', {
            location: location,
            radius: 5000, // 5km 반경으로 확대
            sort: 'distance'
        });
        return response;
    } catch (error) {
        // 디버깅을 위해 오류를 콘솔에 출력
        console.error("지하철역 검색 중 오류 발생:", error);
        return null;
    }
};

// 중간지점 계산 함수
export const calculateCenterPoint = async (addresses: string[]): Promise<naver.maps.LatLng> => {
    // 모든 주소를 좌표로 변환
    const coordinates: naver.maps.LatLng[] = [];
    
    for (const address of addresses) {
        const response = await geocode(address);
        const firstResult = response.v2.addresses[0];
        if (firstResult) {
            const lat = parseFloat(firstResult.y);
            const lng = parseFloat(firstResult.x);
            coordinates.push(new naver.maps.LatLng(lat, lng));
        }
    }

    if (coordinates.length === 0) {
        throw new Error('좌표를 찾을 수 없습니다.');
    }

    // 중간지점 계산 (평균 좌표)
    const totalLat = coordinates.reduce((sum, coord) => sum + coord.lat(), 0);
    const totalLng = coordinates.reduce((sum, coord) => sum + coord.lng(), 0);
    
    const centerLat = totalLat / coordinates.length;
    const centerLng = totalLng / coordinates.length;

    return new naver.maps.LatLng(centerLat, centerLng);
};

// 커스텀 마커 HTML 생성 함수
const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createCustomMarkerHTML = (name: string, emoji: string, color: string, isCenter: boolean = false): string => {
    const centerAnimation = isCenter ? `
        @keyframes centerPulse {
            0% {
                transform: scale(1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(255, 71, 87, 0.7);
            }
            70% {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.4), 0 0 0 10px rgba(255, 71, 87, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(255, 71, 87, 0);
            }
        }
    ` : '';

    const markerAnimation = isCenter ? 'centerPulse 2s infinite' : 'bounce 2s infinite';
    
    return `
        <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform: translateY(-50%);
        ">
            <!-- 마커 핀 -->
            <div style="
                width: ${isCenter ? '50px' : '40px'};
                height: ${isCenter ? '60px' : '50px'};
                background: linear-gradient(135deg, ${hexToRgba(color, 1)}, ${hexToRgba(color, 0.8)});
                border-radius: 20px 20px 20px 5px;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: ${markerAnimation};
            ">
                <span style="
                    font-size: ${isCenter ? '24px' : '20px'};
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                ">${emoji}</span>
            </div>
            
            <!-- 이름 라벨 -->
            <div style="
                background: ${isCenter ? 
                    'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 
                    'linear-gradient(135deg, #667eea, #764ba2)'};
                color: white;
                padding: ${isCenter ? '6px 12px' : '4px 8px'};
                border-radius: 12px;
                font-size: ${isCenter ? '14px' : '12px'};
                font-weight: bold;
                margin-top: 5px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                white-space: nowrap;
                border: 2px solid white;
                ${isCenter ? 'animation: sparkle 3s infinite;' : ''}
            ">${name} ${isCenter ? '✨' : ''}</div>
        </div>
        
        <style>
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(-50%);
            }
            40% {
                transform: translateY(-55%);
            }
            60% {
                transform: translateY(-52%);
            }
        }
        
        ${centerAnimation}
        
        @keyframes sparkle {
            0%, 100% { 
                transform: scale(1); 
            }
            50% { 
                transform: scale(1.05); 
            }
        }
        </style>
    `;
};

// 지도에 마커 추가 함수 (업그레이드 버전)
export const createMarker = (
    map: naver.maps.Map, 
    position: naver.maps.LatLng, 
    name: string,
    type: 'friend' | 'center' | 'station' = 'friend',
    friendIndex?: number
): naver.maps.Marker => {
    let emoji: string;
    let color: string;
    
    if (type === 'center') {
        emoji = '🎯';
        color = '#ff4757'; // 빨간색
    } else if (type === 'station') {
        emoji = '🚇';
        color = '#2ed573'; // 초록색
    } else {
        // 친구별로 다른 이모티콘과 색상
        const friendEmojis = ['🙋‍♂️', '🙋‍♀️', '🤗', '😊', '🎉'];
        const friendColors = ['#3742fa', '#ff6348', '#ffa502', '#a55eea', '#1e90ff'];
        
        emoji = friendEmojis[friendIndex! % friendEmojis.length];
        color = friendColors[friendIndex! % friendColors.length];
    }
    
    const isCenter = type === 'center';
    const markerHTML = createCustomMarkerHTML(name, emoji, color, isCenter);
    
    const marker = new naver.maps.Marker({
        position: position,
        map: map,
        icon: {
            content: markerHTML,
            anchor: new naver.maps.Point(isCenter ? 25 : 20, isCenter ? 60 : 50)
        }
    });

    // 클릭 이벤트 추가 (재미있는 인터랙션)
    naver.maps.Event.addListener(marker, 'click', function() {
        // 마커 클릭 시 통통 튀는 애니메이션
        const markerElement = marker.getElement();
        if (markerElement) {
            markerElement.style.animation = 'none';
            setTimeout(() => {
                markerElement.style.animation = 'bounce 0.6s ease-in-out';
            }, 10);
        }
    });

    return marker;
};

// 여러 마커들이 모두 보이도록 지도 영역 조정
export const fitMapToMarkers = (map: naver.maps.Map, positions: naver.maps.LatLng[]): void => {
    if (positions.length === 0) return;

    const bounds = new naver.maps.LatLngBounds();
    positions.forEach(position => bounds.extend(position));
    
    map.fitBounds(bounds, { padding: 50 });
};

// 모든 마커 제거
export const clearMarkers = (markers: naver.maps.Marker[]): void => {
    markers.forEach(marker => marker.setMap(null));
};