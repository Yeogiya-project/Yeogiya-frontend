import {useState, useCallback, useMemo} from "react";
import type {Friend} from "../types/home";
import { calculateCenterPoint, createMarker, fitMapToMarkers, clearMarkers, searchNearbySubwayStations } from '../utils/naverMapUtils';

export const useModal = () => {
    const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
    const [showMeetupSetupModal, setShowMeetupSetupModal] = useState<boolean>(false);
    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
    const [currentFriendId, setCurrentFriendId] = useState<number>(0);
    const [friends, setFriends] = useState<Friend[]>([
        {id: 1, name: "", address: ""},
        {id: 2, name: "", address: ""}
    ]);
    const [map, setMap] = useState<naver.maps.Map | null>(null);
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

    const openModal = useMemo(() => ({
        welcome: () => setShowWelcomeModal(true),
        meetupSetup: () => setShowMeetupSetupModal(true),
        search: () => setShowSearchModal(true),
    }), []);

    const closeModal = useMemo(() => ({
        welcome: () => setShowWelcomeModal(false),
        meetupSetup: () => setShowMeetupSetupModal(false),
        search: () => setShowSearchModal(false),
    }), []);

    const handleStart = useCallback(() => {
        closeModal.welcome();
        openModal.meetupSetup();
    }, [closeModal, openModal]);

    const handleSearchAddress = useCallback((friendId: number) => {
        setCurrentFriendId(friendId);
        openModal.search();
    }, [openModal]);

    const handleCloseMeetupSetup = useCallback(() => {
        closeModal.meetupSetup();
        openModal.welcome();
    }, [closeModal, openModal]);

    const updateFriend = useCallback((id: number, field: 'name' | 'address', value: string) => {
        setFriends(prev => prev.map(friend =>
            friend.id === id ? {...friend, [field]: value} : friend
        ));
    }, []);

    const addFriend = useCallback(() => {
        if (friends.length < 5) {
            setFriends(prev => [...prev, {
                id: Math.max(...prev.map(f => f.id)) + 1,
                name: "",
                address: ""
            }]);
        }
    }, [friends.length]);

    const removeFriend = useCallback((id: number) => {
        if (friends.length > 2) {
            setFriends(prev => prev.filter(friend => friend.id !== id));
        }
    }, [friends.length]);

    const handleSelectAddress = useCallback((address: string) => {
        updateFriend(currentFriendId, 'address', address);
        closeModal.search();
    }, [closeModal, currentFriendId, updateFriend]);

    const handleFindMeetingPoint = useCallback(async (friendsData: Friend[]) => {
        if (!map) {
            return;
        }

        try {
            // 기존 마커들 제거
            clearMarkers(markers);
            
            // 주소 목록 추출
            const addresses = friendsData.map(friend => friend.address);

            // 중간지점 계산
            const centerPoint = await calculateCenterPoint(addresses);

            // 새로운 마커들 생성
            const newMarkers: naver.maps.Marker[] = [];
            const allPositions: naver.maps.LatLng[] = [];

            // 친구들 위치 마커 추가
            for (let i = 0; i < friendsData.length; i++) {
                const friend = friendsData[i];
                try {
                    // geocode 함수 사용하여 주소를 좌표로 변환
                    const response = await import('../utils/naverMapUtils').then(utils => utils.geocode(friend.address));
                    if (response.v2.addresses.length > 0) {
                        const addr = response.v2.addresses[0];
                        const position = new naver.maps.LatLng(parseFloat(addr.y), parseFloat(addr.x));
                        
                        // 업그레이드된 마커 생성 (친구 이름과 인덱스 전달)
                        const marker = createMarker(map, position, friend.name, 'friend', i);
                        newMarkers.push(marker);
                        allPositions.push(position);
                    }
                } catch (error) {
                }
            }

            // 중간지점 마커 추가 (특별한 디자인)
            const centerMarker = createMarker(map, centerPoint, '만날 곳!', 'center');
            newMarkers.push(centerMarker);
            allPositions.push(centerPoint);

            // --- [디버깅용 로그] --- //
            console.log(`중간지점 좌표: lat=${centerPoint.lat()}, lng=${centerPoint.lng()}`);
            // --- [디버깅용 로그 끝] --- //

            // 가장 가까운 지하철역 검색 및 마커 추가
            const subwayStationResult = await searchNearbySubwayStations(centerPoint);

            // --- [디버깅용 로그] --- //
            console.log("--- 지하철역 검색 결과 ---");
            if (subwayStationResult) {
                console.log("API 응답 (전체):", subwayStationResult);
                console.log("검색된 역 목록:", subwayStationResult.result.items);
            } else {
                console.log("검색된 지하철역이 없습니다.");
            }
            // --- [디버깅용 로그 끝] --- //

            if (subwayStationResult && subwayStationResult.result.items.length > 0) {
                // 거리를 기준으로 결과를 직접 정렬
                const sortedStations = subwayStationResult.result.items.sort((a, b) => {
                    return parseFloat(a.distance || '0') - parseFloat(b.distance || '0');
                });
                const nearestStation = sortedStations[0];
                const stationPosition = new naver.maps.LatLng(parseFloat(nearestStation.mapy), parseFloat(nearestStation.mapx));
                const stationName = nearestStation.title.replace(/<\/?b>/g, '');
                const stationMarker = createMarker(map, stationPosition, stationName, 'station');
                newMarkers.push(stationMarker);
                allPositions.push(stationPosition);
            }

            // 마커 상태 업데이트
            setMarkers(newMarkers);

            // 모든 마커가 보이도록 지도 영역 조정
            fitMapToMarkers(map, allPositions);

            // 모달 닫기
            closeModal.meetupSetup();
            
        } catch (error) {
            alert('중간지점을 찾는 중 오류가 발생했습니다.');
        }
    }, [map, markers, closeModal]);

    // 지도 및 데이터 초기화 함수
    const handleReset = useCallback(() => {
        // 기존 마커들 제거
        clearMarkers(markers);
        setMarkers([]);
        
        // 친구 데이터 초기화
        setFriends([
            {id: 1, name: "", address: ""},
            {id: 2, name: "", address: ""}
        ]);
        
        // 지도를 서울 시청으로 리셋
        if (map) {
            map.setCenter(new naver.maps.LatLng(37.5666805, 126.9784147));
            map.setZoom(10);
        }
        
    }, [map, markers]);

    // 새로운 검색 시작 (Welcome 모달 열기)
    const handleNewSearch = useCallback(() => {
        handleReset();
        openModal.welcome();
    }, [handleReset, openModal]);

    return {
        show: {
            welcome: showWelcomeModal,
            meetupSetup: showMeetupSetupModal,
            search: showSearchModal
        },
        openModal,
        closeModal,
        handlers: {
            handleStart,
            handleSearchAddress,
            handleCloseMeetupSetup,
            handleSelectAddress,
            handleFindMeetingPoint,
            handleReset,
            handleNewSearch
        },
        friends: {
            data: friends,
            updateFriend,
            addFriend,
            removeFriend
        },
        currentFriendId,
        map: {
            instance: map,
            setMap,
            markers,
            setMarkers
        }
    };
}