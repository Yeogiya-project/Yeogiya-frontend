import {useState} from "react";
import type {Friend} from "../types/home.ts";
import {api} from "../utils/Api.tsx";
import type {MeetingPlaceResponse, MeetingLocation} from "../types/api.ts";

export const useModal = () => {
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
    const [showMeetupSetupModal, setShowMeetupSetupModal] = useState<boolean>(false);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [currentFriendId, setCurrentFriendId] = useState<number>(0);
    const [meetingPointInfo, setMeetingPointInfo] = useState<MeetingPlaceResponse | null>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [nearbyMarkers, setNearbyMarkers] = useState<{
        subway: any[];
        restaurant: any[];
        cafe: any[];
    }>({
        subway: [],
        restaurant: [],
        cafe: []
    });
    const [friendCoordinates, setFriendCoordinates] = useState<Map<number, { lat: number, lng: number }>>(new Map());
    const [nearbyPlaces, setNearbyPlaces] = useState<{
        subways: any[];
        restaurants: any[];
        cafes: any[];
        loading: boolean;
    }>({
        subways: [],
        restaurants: [],
        cafes: [],
        loading: false
    });
    const [showNearbyPanel, setShowNearbyPanel] = useState<boolean>(false);
    const openWelcomeModal = () => setShowWelcomeModal(true);
    const closeWelcomeModal = () => setShowWelcomeModal(false);
    const openMeetupSetupModal = () => setShowMeetupSetupModal(true);
    const closeMeetupSetupModal = () => setShowMeetupSetupModal(false);
    const openSearchModal = () => setShowSearchModal(true);
    const closeSearchModal = () => setShowSearchModal(false);
    const toggleNearbyPanel = () => setShowNearbyPanel(prev => !prev);
    const openNearbyPanel = () => setShowNearbyPanel(true);
    const closeNearbyPanel = () => setShowNearbyPanel(false);
    const [friends, setFriends] = useState<Friend[]>([
        {id: 1, name: "", address: ""},
        {id: 2, name: "", address: ""}
    ])
    const handleStart = () => {
        closeWelcomeModal();
        openMeetupSetupModal();
    }
    const handleCloseMeetupSetup = () => {
        closeMeetupSetupModal();
        openWelcomeModal();
    }

    // 주소 검색 버튼 클릭
    const handleSearchAddress = (friendId: number) => {
        setCurrentFriendId(friendId);
        openSearchModal();
    };

    // 마커 클리어 함수
    const clearMarkers = (markersToRemove: any[]) => {
        markersToRemove.forEach(marker => marker.setMap(null));
    };

    // 주변 장소 검색 함수
    const searchNearbyPlaces = async (lat: number, lng: number) => {
        setNearbyPlaces(prev => ({...prev, loading: true}));

        try {
            // 병렬로 여러 카테고리 검색
            const [subwayResults, restaurantResults, cafeResults] = await Promise.all([
                // 지하철역 (SW8)
                api.searchPlaces('', 'CATEGORY', {
                    categoryGroupCode: 'SW8',
                    x: lng,
                    y: lat,
                    radius: 2000,
                    sort: 'distance',
                    size: 5
                }),
                // 음식점 (FD6)
                api.searchPlaces('', 'CATEGORY', {
                    categoryGroupCode: 'FD6',
                    x: lng,
                    y: lat,
                    radius: 1000,
                    sort: 'distance',
                    size: 8
                }),
                // 카페 (CE7)
                api.searchPlaces('', 'CATEGORY', {
                    categoryGroupCode: 'CE7',
                    x: lng,
                    y: lat,
                    radius: 1000,
                    sort: 'distance',
                    size: 5
                })
            ]);

            setNearbyPlaces({
                subways: subwayResults.documents || [],
                restaurants: restaurantResults.documents || [],
                cafes: cafeResults.documents || [],
                loading: false
            });

            // 주변 장소 마커 생성 (처음에는 숨김 상태로)
            const subwayMarkers: any[] = [];
            const restaurantMarkers: any[] = [];
            const cafeMarkers: any[] = [];

            // 지하철역 마커
            (subwayResults.documents || []).forEach((place: any, index: number) => {
                const position = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
                const marker = createNearbyPlaceMarker(position, place, 'subway', index);
                // 처음에는 지도에 표시하지 않음
                subwayMarkers.push(marker);
            });

            // 음식점 마커
            (restaurantResults.documents || []).forEach((place: any, index: number) => {
                const position = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
                const marker = createNearbyPlaceMarker(position, place, 'restaurant', index);
                // 처음에는 지도에 표시하지 않음
                restaurantMarkers.push(marker);
            });

            // 카페 마커
            (cafeResults.documents || []).forEach((place: any, index: number) => {
                const position = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
                const marker = createNearbyPlaceMarker(position, place, 'cafe', index);
                // 처음에는 지도에 표시하지 않음
                cafeMarkers.push(marker);
            });

            // 카테고리별로 마커 저장
            const newNearbyMarkers = {
                subway: subwayMarkers,
                restaurant: restaurantMarkers,
                cafe: cafeMarkers
            };

            setNearbyMarkers(newNearbyMarkers);

            // 기본적으로 지하철역 마커만 표시
            subwayMarkers.forEach(marker => marker.setMap(map));

            console.log('주변 장소 검색 완료:', {
                지하철역: subwayResults.documents?.length || 0,
                음식점: restaurantResults.documents?.length || 0,
                카페: cafeResults.documents?.length || 0,
                '생성된 마커': subwayMarkers.length + restaurantMarkers.length + cafeMarkers.length
            });

        } catch (error) {
            console.error('주변 장소 검색 실패:', error);
            setNearbyPlaces(prev => ({...prev, loading: false}));
        }
    };

    // 네이버 스타일 마커 생성 함수
    const createKakaoMarker = (
        position: kakao.maps.LatLng,
        name: string,
        type: 'friend' | 'center' = 'friend',
        friendIndex?: number
    ) => {
        let emoji: string;
        let color: string;

        if (type === 'center') {
            emoji = '🎯';
            color = '#ff4757';
        } else {
            const friendEmojis = ['🙋‍♂️', '🙋‍♀️', '🤗', '😊', '🎉'];
            const friendColors = ['#3742fa', '#ff6348', '#ffa502', '#a55eea', '#1e90ff'];

            emoji = friendEmojis[friendIndex! % friendEmojis.length];
            color = friendColors[friendIndex! % friendColors.length];
        }

        const isCenter = type === 'center';

        const hexToRgba = (hex: string, alpha: number): string => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const markerHTML = `
            <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translateY(-50%);
            ">
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
                    animation: ${isCenter ? 'centerPulse 2s infinite' : 'bounce 2s infinite'};
                ">
                    <span style="
                        font-size: ${isCenter ? '24px' : '20px'};
                        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                    ">${emoji}</span>
                </div>
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

        const customOverlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: markerHTML,
            yAnchor: 1
        });

        // 마커 클릭 이벤트 추가 (네이버와 동일한 기능)
        const markerElement = customOverlay.getContent();
        if (markerElement && typeof markerElement === 'object' && 'addEventListener' in markerElement) {
            (markerElement as HTMLElement).addEventListener('click', () => {
                if (map) {
                    map.setCenter(position);
                    map.setLevel(5);

                    // 마커 정보를 알림으로 표시
                    const markerInfo = type === 'center' ?
                        `중간지점: ${name}` :
                        `${name}의 위치`;

                    // 간단한 정보 표시 (실제 구현에서는 InfoWindow나 커스텀 팝업 사용 가능)
                    console.log(`마커 클릭: ${markerInfo}`);
                }
            });
        }

        return customOverlay;
    };

    // 주변 장소 마커 생성 함수
    const createNearbyPlaceMarker = (
        position: kakao.maps.LatLng,
        place: any,
        type: 'subway' | 'restaurant' | 'cafe',
        index: number
    ) => {
        let emoji: string;
        let color: string;
        let bgColor: string;

        switch (type) {
            case 'subway':
                emoji = '🚇';
                color = '#3b82f6'; // blue-500
                bgColor = '#dbeafe'; // blue-100
                break;
            case 'restaurant':
                emoji = '🍽️';
                color = '#f97316'; // orange-500
                bgColor = '#fed7aa'; // orange-100
                break;
            case 'cafe':
                emoji = '☕';
                color = '#f59e0b'; // amber-500
                bgColor = '#fef3c7'; // amber-100
                break;
        }

        const markerHTML = `
            <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translateY(-50%);
            ">
                <div style="
                    width: 32px;
                    height: 32px;
                    background: ${color};
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: transform 0.2s ease;
                ">
                    <span style="
                        font-size: 14px;
                        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
                    ">${emoji}</span>
                </div>
                <div style="
                    background: white;
                    color: ${color};
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: bold;
                    margin-top: 2px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    white-space: nowrap;
                    border: 1px solid ${bgColor};
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                ">${place.place_name}</div>
            </div>
            <style>
            @keyframes nearbyBounce {
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
            </style>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: markerHTML,
            yAnchor: 1
        });

        // 마커 클릭 이벤트
        const markerElement = customOverlay.getContent();
        if (markerElement && typeof markerElement === 'object' && 'addEventListener' in markerElement) {
            (markerElement as HTMLElement).addEventListener('click', () => {
                if (map) {
                    map.setCenter(position);
                    map.setLevel(3);

                    // 장소 정보 팝업 표시
                    const info = `📍 ${place.place_name}\n🏠 ${place.address_name}${place.phone ? `\n📞 ${place.phone}` : ''}`;
                    alert(info);
                }
            });

            // 호버 효과
            (markerElement as HTMLElement).addEventListener('mouseenter', () => {
                (markerElement as HTMLElement).style.transform = 'translateY(-50%) scale(1.1)';
            });

            (markerElement as HTMLElement).addEventListener('mouseleave', () => {
                (markerElement as HTMLElement).style.transform = 'translateY(-50%) scale(1)';
            });
        }

        return customOverlay;
    };

    // 카테고리별 마커 필터링 함수
    const filterNearbyMarkers = (activeCategory: 'subway' | 'restaurant' | 'cafe') => {
        // 모든 마커 숨기기
        Object.values(nearbyMarkers).flat().forEach(marker => {
            marker.setMap(null);
        });

        // 선택된 카테고리 마커만 표시
        nearbyMarkers[activeCategory].forEach(marker => {
            marker.setMap(map);
        });
    };

    // 주소 선택 처리
    const handleSelectAddress = (selectedAddress: any) => {
        updateFriend(currentFriendId, 'address', selectedAddress.address);
        closeSearchModal();

        // 카카오 지도에 커스텀 마커 추가
        if (map && selectedAddress.mapX && selectedAddress.mapY) {
            const lat = parseFloat(selectedAddress.mapY);
            const lng = parseFloat(selectedAddress.mapX);
            const position = new window.kakao.maps.LatLng(lat, lng);

            // 친구 정보 가져오기
            const friend = friends.find(f => f.id === currentFriendId);
            const friendIndex = friends.findIndex(f => f.id === currentFriendId);

            // 네이버 스타일 마커 생성
            const customMarker = createKakaoMarker(position, friend?.name || `친구 ${friendIndex + 1}`, 'friend', friendIndex);
            customMarker.setMap(map);

            // 마커 배열에 추가
            setMarkers(prev => [...prev, customMarker]);

            // 친구의 좌표 정보 저장
            setFriendCoordinates(prev => {
                const newMap = new Map(prev);
                newMap.set(currentFriendId, {lat, lng});
                return newMap;
            });
        }
    };

    // 중간지점 찾기
    const handleFindMeetingPoint = async () => {
        if (!map) return;

        const validFriends = friends.filter(friend => friend.address.trim() !== '');
        if (validFriends.length < 2) {
            alert('최소 2명의 친구 주소가 필요합니다.');
            return;
        }

        // 좌표 정보가 있는 친구들 확인
        const meetingLocations: MeetingLocation[] = [];
        for (const friend of validFriends) {
            const coordinates = friendCoordinates.get(friend.id);
            if (coordinates) {
                meetingLocations.push({
                    lat: coordinates.lat,
                    lng: coordinates.lng
                });
            }
        }

        if (meetingLocations.length < 2) {
            alert('주소 검색을 통해 선택된 친구들의 위치 정보가 필요합니다.');
            return;
        }

        try {
            console.log('중간지점 계산 요청 좌표들:', meetingLocations);

            // 백엔드 API 호출 (음식점 카테고리로 기본 설정)
            const meetingPlaceResult = await api.findMeetingPlace({
                meetingLocations,
                categoryGroupCode: 'FD6', // 음식점
                radius: 5000, // 5km
                size: 10
            });
            console.log('중간지점 계산 결과:', meetingPlaceResult);

            // 중간지점 정보 저장
            setMeetingPointInfo(meetingPlaceResult);

            // 추천 장소 정보 로그 출력 (디버깅용)
            if (meetingPlaceResult.recommendedPlaces && meetingPlaceResult.recommendedPlaces.length > 0) {
                console.log('추천 장소들:', meetingPlaceResult.recommendedPlaces);
            }

            // 지도에 중간지점 커스텀 마커 추가
            const centerPosition = new window.kakao.maps.LatLng(
                meetingPlaceResult.meetingCenterPoint.lat,
                meetingPlaceResult.meetingCenterPoint.lng
            );

            // 중간지점 네이버 스타일 마커 생성
            const centerMarker = createKakaoMarker(centerPosition, '중간지점', 'center');
            centerMarker.setMap(map);

            // 마커 배열에 추가
            setMarkers(prev => [...prev, centerMarker]);

            // 지도 중심을 중간지점으로 이동
            map.setCenter(centerPosition);
            map.setLevel(5); // 적절한 줌 레벨 설정

            // 중간지점 주변 장소 검색
            await searchNearbyPlaces(
                meetingPlaceResult.meetingCenterPoint.lat,
                meetingPlaceResult.meetingCenterPoint.lng
            );

            // 주변 정보 패널 열기
            setShowNearbyPanel(true);

            // MeetupSetupModal 닫기
            closeMeetupSetupModal();

        } catch (error) {
            console.error('중간지점 찾기 실패:', error);
            alert('중간지점을 찾는 중 오류가 발생했습니다.');
        }
    };
    // === 친구 데이터 관리 함수들 ===

    // 친구 정보 업데이트 (이름 또는 주소)
    const updateFriend = (id: number, field: 'name' | 'address', value: string) => {
        setFriends(prevFriends =>
            prevFriends.map(friend =>
                friend.id === id ? {...friend, [field]: value} : friend
            )
        );
    };

    // 친구 추가 (최대 6명)
    const addFriend = () => {
        if (friends.length < 6) {
            const newId = Math.max(...friends.map(f => f.id)) + 1;
            setFriends(prevFriends => [...prevFriends, {id: newId, name: "", address: ""}]);
        }
    };

    // 친구 삭제 (최소 2명 유지)
    const removeFriend = (id: number) => {
        if (friends.length > 2) {
            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== id));
        }
    };

    // 모든 데이터 초기화
    const handleReset = () => {
        clearMarkers(markers);
        // 주변 마커들도 클리어
        Object.values(nearbyMarkers).flat().forEach(marker => marker.setMap(null));
        setMarkers([]);
        setNearbyMarkers({
            subway: [],
            restaurant: [],
            cafe: []
        });
        setFriends([
            {id: 1, name: "", address: ""},
            {id: 2, name: "", address: ""}
        ]);
        setMeetingPointInfo(null);
        setFriendCoordinates(new Map()); // 좌표 정보도 초기화
        setNearbyPlaces({
            subways: [],
            restaurants: [],
            cafes: [],
            loading: false
        }); // 주변 정보도 초기화
        setShowNearbyPanel(false); // 패널도 닫기

        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(37.5666805, 126.9784147)); // 서울 시청
            map.setLevel(4);
        }
    };

    // 새로운 검색 시작
    const handleNewSearch = () => {
        handleReset();
        openWelcomeModal();
    };

    // URL로 이동하는 함수
    const handleOpenUrl = (url?: string) => {
        if(url){
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    return {
        show: {
            welcome: showWelcomeModal,
            meetupSetup: showMeetupSetupModal,
            search: showSearchModal,
            nearbyPanel: showNearbyPanel
        },
        openModal: {
            welcome: openWelcomeModal,
            meetupSetup: openMeetupSetupModal,
            search: openSearchModal
        },
        closeModal: {
            welcome: closeWelcomeModal,
            meetupSetup: closeMeetupSetupModal,
            search: closeSearchModal,
            nearbyPanel: closeNearbyPanel
        },
        handlers: {
            handleStart,
            handleCloseMeetupSetup,
            handleSearchAddress,
            handleSelectAddress,
            handleFindMeetingPoint,
            handleReset,
            handleNewSearch,
            toggleNearbyPanel,
            filterNearbyMarkers
        },
        friends: {
            data: friends,
            updateFriend,
            addFriend,
            removeFriend
        },
        map: {
            instance: map,
            setMap,
        },
        meetingPointInfo,
        markers,
        nearbyMarkers,
        nearbyPlaces,
        handleOpenUrl
    };
};