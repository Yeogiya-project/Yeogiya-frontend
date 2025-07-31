import { useState } from "react";
import type { Friend } from "../types/home";
import { createMarker, fitMapToMarkers, clearMarkers } from '../utils/naverMapUtils';
import { apiClient } from '../utils/api/Api';

// 모달과 친구 데이터를 관리하는 간단한 훅
export const useModal = () => {
    // 모달 상태들
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
    const [showMeetupSetupModal, setShowMeetupSetupModal] = useState<boolean>(false);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    
    // 현재 주소를 검색중인 친구 ID
    const [currentFriendId, setCurrentFriendId] = useState<number>(0);
    
    // 친구들 데이터 (기본값: 2명)
    const [friends, setFriends] = useState<Friend[]>([
        { id: 1, name: "", address: "" },
        { id: 2, name: "", address: "" }
    ]);
    
    // 지도와 마커들
    const [map, setMap] = useState<naver.maps.Map | null>(null);
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

    // === 모달 열기/닫기 함수들 ===
    const openWelcomeModal = () => setShowWelcomeModal(true);
    const closeWelcomeModal = () => setShowWelcomeModal(false);
    const openMeetupSetupModal = () => setShowMeetupSetupModal(true);
    const closeMeetupSetupModal = () => setShowMeetupSetupModal(false);
    const openSearchModal = () => setShowSearchModal(true);
    const closeSearchModal = () => setShowSearchModal(false);

    // === 기본 동작 함수들 ===
    
    // 시작하기 버튼 클릭
    const handleStart = () => {
        closeWelcomeModal();
        openMeetupSetupModal();
    };

    // 뒤로가기 버튼 클릭
    const handleCloseMeetupSetup = () => {
        closeMeetupSetupModal();
        openWelcomeModal();
    };

    // 주소 검색 버튼 클릭
    const handleSearchAddress = (friendId: number) => {
        setCurrentFriendId(friendId);
        openSearchModal();
    };

    // 주소 선택 완료
    const handleSelectAddress = (address: string) => {
        updateFriend(currentFriendId, 'address', address);
        closeSearchModal();
    };

    // === 친구 데이터 관리 함수들 ===
    
    // 친구 정보 업데이트 (이름 또는 주소)
    const updateFriend = (id: number, field: 'name' | 'address', value: string) => {
        setFriends(prevFriends => 
            prevFriends.map(friend => 
                friend.id === id ? { ...friend, [field]: value } : friend
            )
        );
    };

    // 친구 추가 (최대 5명)
    const addFriend = () => {
        if (friends.length < 5) {
            const newId = Math.max(...friends.map(f => f.id)) + 1;
            setFriends(prevFriends => [...prevFriends, { id: newId, name: "", address: "" }]);
        }
    };

    // 친구 삭제 (최소 2명 유지)
    const removeFriend = (id: number) => {
        if (friends.length > 2) {
            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== id));
        }
    };

    // === 중간지점 찾기 메인 함수 ===
    const handleFindMeetingPoint = async (friendsData: Friend[]) => {
        if (!map) return;

        try {
            console.log('중간지점 찾기 시작...');
            
            // 기존 마커들 제거
            clearMarkers(markers);
            
            // 1단계: 각 친구의 주소를 좌표로 변환
            const locations: Array<{lat: number, lng: number}> = [];
            
            for (const friend of friendsData) {
                try {
                    const response = await apiClient.searchAddress(friend.address);
                    if (response.items && response.items.length > 0) {
                        const item = response.items[0];
                        locations.push({
                            lat: parseFloat(item.mapY),
                            lng: parseFloat(item.mapX)
                        });
                        console.log(`${friend.name} 위치:`, item.mapY, item.mapX);
                    }
                } catch (error) {
                    console.error(`${friend.name} 주소 변환 실패:`, error);
                }
            }

            if (locations.length < 2) {
                alert('중간지점을 계산하기에 유효한 주소가 부족합니다.');
                return;
            }

            // 2단계: 중간지점 계산
            const centerResult = await apiClient.calculateCenterPoint(locations);
            const centerPoint = new naver.maps.LatLng(centerResult.lat, centerResult.lng);
            console.log('중간지점:', centerResult.lat, centerResult.lng);

            // 3단계: 지도에 마커들 표시
            const newMarkers: naver.maps.Marker[] = [];
            const allPositions: naver.maps.LatLng[] = [];

            // 친구들 위치 마커 추가
            friendsData.forEach((friend, index) => {
                if (index < locations.length) {
                    const location = locations[index];
                    const position = new naver.maps.LatLng(location.lat, location.lng);
                    const marker = createMarker(map, position, friend.name, 'friend', index);
                    newMarkers.push(marker);
                    allPositions.push(position);
                }
            });

            // 중간지점 마커 추가
            const centerMarker = createMarker(map, centerPoint, '중간지점', 'center');
            newMarkers.push(centerMarker);
            allPositions.push(centerPoint);

            // 4단계: 근처 지하철역 찾기
            try {
                const stationResult = await apiClient.findNearbyStations(centerResult.lat, centerResult.lng);
                if (stationResult?.items?.length > 0) {
                    const nearestStation = stationResult.items[0];
                    const stationPosition = new naver.maps.LatLng(
                        parseFloat(nearestStation.mapY), 
                        parseFloat(nearestStation.mapX)
                    );
                    const stationName = nearestStation.title.replace(/<\/?b>/g, '');
                    const stationMarker = createMarker(map, stationPosition, stationName, 'station');
                    newMarkers.push(stationMarker);
                    allPositions.push(stationPosition);
                    console.log('가장 가까운 지하철역:', stationName);
                }
            } catch (error) {
                console.error('지하철역 검색 실패:', error);
            }

            // 5단계: 지도 영역 조정 및 완료
            setMarkers(newMarkers);
            fitMapToMarkers(map, allPositions);
            closeMeetupSetupModal();
            
            console.log('중간지점 찾기 완료!');

        } catch (error) {
            console.error('중간지점 찾기 실패:', error);
            alert('중간지점을 찾는 중 오류가 발생했습니다.');
        }
    };

    // === 초기화 및 새 검색 함수들 ===
    
    // 모든 데이터 초기화
    const handleReset = () => {
        clearMarkers(markers);
        setMarkers([]);
        setFriends([
            { id: 1, name: "", address: "" },
            { id: 2, name: "", address: "" }
        ]);
        
        if (map) {
            map.setCenter(new naver.maps.LatLng(37.5666805, 126.9784147)); // 서울 시청
            map.setZoom(16);
        }
    };

    // 새로운 검색 시작
    const handleNewSearch = () => {
        handleReset();
        openWelcomeModal();
    };

    // 외부에서 사용할 모든 데이터와 함수들 반환
    return {
        // 모달 상태
        show: {
            welcome: showWelcomeModal,
            meetupSetup: showMeetupSetupModal,
            search: showSearchModal
        },
        
        // 모달 제어 함수들
        openModal: {
            welcome: openWelcomeModal,
            meetupSetup: openMeetupSetupModal,
            search: openSearchModal
        },
        closeModal: {
            welcome: closeWelcomeModal,
            meetupSetup: closeMeetupSetupModal,
            search: closeSearchModal
        },
        
        // 주요 동작 함수들
        handlers: {
            handleStart,
            handleSearchAddress,
            handleCloseMeetupSetup,
            handleSelectAddress,
            handleFindMeetingPoint,
            handleReset,
            handleNewSearch
        },
        
        // 친구 데이터와 관리 함수들
        friends: {
            data: friends,
            updateFriend,
            addFriend,
            removeFriend
        },
        
        // 현재 검색중인 친구 ID
        currentFriendId,
        
        // 지도와 마커 정보
        map: {
            instance: map,
            setMap,
            markers,
            setMarkers
        }
    };
};