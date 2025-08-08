// import {useState} from "react";
// import type {Friend} from "../../../types/home/home.ts";
// import {createMarker, fitMapToMarkers, clearMarkers} from '../../../utils/home/naverMapUtils.ts';
// import {useNaverGeocode} from './useNaverGeocode.ts';
//
// interface MeetingPointInfo {
//     lat: number;
//     lng: number;
//     friendCount: number;
// }
//
// // 모달과 친구 데이터를 관리하는 간단한 훅
// export const useModal = () => {
//     const {geocodeAddress} = useNaverGeocode();
//
//     // 모달 상태들
//     const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
//     const [showMeetupSetupModal, setShowMeetupSetupModal] = useState<boolean>(false);
//     const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
//
//     // 중간지점 정보 상태
//     const [meetingPointInfo, setMeetingPointInfo] = useState<MeetingPointInfo | null>(null);
//
//     // 현재 주소를 검색중인 친구 ID
//     const [currentFriendId, setCurrentFriendId] = useState<number>(0);
//
//     // 친구들 데이터 (기본값: 2명)
//     const [friends, setFriends] = useState<Friend[]>([
//         {id: 1, name: "", address: ""},
//         {id: 2, name: "", address: ""}
//     ]);
//
//     // 지도와 마커들
//     const [map, setMap] = useState<naver.maps.Map | null>(null);
//     const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
//
//     // === 모달 열기/닫기 함수들 ===
//     const openWelcomeModal = () => setShowWelcomeModal(true);
//     const closeWelcomeModal = () => setShowWelcomeModal(false);
//     const openMeetupSetupModal = () => setShowMeetupSetupModal(true);
//     const closeMeetupSetupModal = () => setShowMeetupSetupModal(false);
//     const openSearchModal = () => setShowSearchModal(true);
//     const closeSearchModal = () => setShowSearchModal(false);
//
//     // === 기본 동작 함수들 ===
//
//     // 시작하기 버튼 클릭
//     const handleStart = () => {
//         closeWelcomeModal();
//         openMeetupSetupModal();
//     };
//
//     // 뒤로가기 버튼 클릭
//     const handleCloseMeetupSetup = () => {
//         closeMeetupSetupModal();
//         openWelcomeModal();
//     };
//
//     // 주소 검색 버튼 클릭
//     const handleSearchAddress = (friendId: number) => {
//         setCurrentFriendId(friendId);
//         openSearchModal();
//     };
//
//     // 주소 선택 완료
//     const handleSelectAddress = (address: string) => {
//         updateFriend(currentFriendId, 'address', address);
//         closeSearchModal();
//     };
//
//     // === 친구 데이터 관리 함수들 ===
//
//     // 친구 정보 업데이트 (이름 또는 주소)
//     const updateFriend = (id: number, field: 'name' | 'address', value: string) => {
//         setFriends(prevFriends =>
//             prevFriends.map(friend =>
//                 friend.id === id ? {...friend, [field]: value} : friend
//             )
//         );
//     };
//
//     // 친구 추가 (최대 5명)
//     const addFriend = () => {
//         if (friends.length < 5) {
//             const newId = Math.max(...friends.map(f => f.id)) + 1;
//             setFriends(prevFriends => [...prevFriends, {id: newId, name: "", address: ""}]);
//         }
//     };
//
//     // 친구 삭제 (최소 2명 유지)
//     const removeFriend = (id: number) => {
//         if (friends.length > 2) {
//             setFriends(prevFriends => prevFriends.filter(friend => friend.id !== id));
//         }
//     };
//
//     // === 중간지점 찾기 메인 함수 ===
//     const handleFindMeetingPoint = async (friendsData: Friend[]) => {
//         if (!map) return;
//
//         try {
//             console.log('중간지점 찾기 시작...');
//
//             // 기존 마커들 제거
//             clearMarkers(markers);
//
//             // 1단계: 각 친구의 주소를 좌표로 변환
//             const locations: Array<{ lat: number, lng: number }> = [];
//             const failedAddresses: string[] = [];
//
//             for (const friend of friendsData) {
//                 // 주소 유효성 사전 검증
//                 if (!friend.address || friend.address.trim().length < 3) {
//                     failedAddresses.push(`${friend.name}: 주소가 입력되지 않음`);
//                     console.log(`${friend.name}의 주소 정보:`, friend.address);
//                     continue;
//                 }
//
//                 try {
//                     console.log(`${friend.name}의 주소로 검색 시도:`, friend.address);
//
//                     // 네이버 지오코딩 사용 (훅에서 가져온 함수)
//                     const results = await geocodeAddress(friend.address);
//
//                     if (results.length > 0) {
//                         const coords = {
//                             lat: parseFloat(results[0].mapY),
//                             lng: parseFloat(results[0].mapX)
//                         };
//                         locations.push(coords);
//                         console.log(`${friend.name} 위치:`, coords.lat, coords.lng);
//                     } else {
//                         failedAddresses.push(`${friend.name}: 주소를 찾을 수 없음`);
//                     }
//                 } catch (error) {
//                     console.error(`${friend.name} 주소 변환 실패:`, error);
//                     failedAddresses.push(`${friend.name}: API 호출 실패`);
//                 }
//             }
//
//             // 실패한 주소가 있으면 사용자에게 알림
//             if (failedAddresses.length > 0) {
//                 console.warn('주소 변환 실패:', failedAddresses);
//             }
//
//             if (locations.length < 2) {
//                 const message = failedAddresses.length > 0
//                     ? `중간지점을 계산하기에 유효한 주소가 부족합니다.\n실패한 주소: ${failedAddresses.join(', ')}`
//                     : '중간지점을 계산하기에 유효한 주소가 부족합니다. (최소 2개 필요)';
//                 alert(message);
//                 return;
//             }
//
//             // 2단계: 중간지점 계산 (간단한 평균 계산)
//             const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
//             const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
//             const centerPoint = new naver.maps.LatLng(centerLat, centerLng);
//             console.log('중간지점:', centerLat, centerLng);
//
//             // 3단계: 지도에 마커들 표시
//             const newMarkers: naver.maps.Marker[] = [];
//             const allPositions: naver.maps.LatLng[] = [];
//
//             // 친구들 위치 마커 추가
//             friendsData.forEach((friend, index) => {
//                 if (index < locations.length) {
//                     const location = locations[index];
//                     const position = new naver.maps.LatLng(location.lat, location.lng);
//                     const marker = createMarker(map, position, friend.name, 'friend', index);
//                     newMarkers.push(marker);
//                     allPositions.push(position);
//                 }
//             });
//
//             // 중간지점 마커 추가
//             const centerMarker = createMarker(map, centerPoint, '중간지점', 'center');
//             newMarkers.push(centerMarker);
//             allPositions.push(centerPoint);
//
//             // 4단계: 지도 영역 조정 및 완료
//             setMarkers(newMarkers);
//
//             // 중간지점을 중심으로 적절한 줌으로 설정
//             map.setCenter(centerPoint);
//             map.setZoom(14); // 적절한 줌 레벨
//
//             // 모든 마커가 보이도록 추가 조정
//             setTimeout(() => {
//                 fitMapToMarkers(map, allPositions);
//                 // 너무 가까우면 적절한 줌으로 조정
//                 if (map.getZoom() > 16) {
//                     map.setZoom(16);
//                 } else if (map.getZoom() < 12) {
//                     map.setZoom(12);
//                 }
//             }, 100);
//
//             // 중간지점 정보 저장
//             setMeetingPointInfo({
//                 lat: centerLat,
//                 lng: centerLng,
//                 friendCount: locations.length
//             });
//
//             closeMeetupSetupModal();
//             console.log('중간지점 찾기 완료!');
//
//         } catch (error) {
//             console.error('중간지점 찾기 실패:', error);
//             alert('중간지점을 찾는 중 오류가 발생했습니다.');
//         }
//     };
//
//     // === 초기화 및 새 검색 함수들 ===
//
//     // 모든 데이터 초기화
//     const handleReset = () => {
//         clearMarkers(markers);
//         setMarkers([]);
//         setFriends([
//             {id: 1, name: "", address: ""},
//             {id: 2, name: "", address: ""}
//         ]);
//         setMeetingPointInfo(null);
//
//         if (map) {
//             map.setCenter(new naver.maps.LatLng(37.5666805, 126.9784147)); // 서울 시청
//             map.setZoom(16);
//         }
//     };
//
//     // 새로운 검색 시작
//     const handleNewSearch = () => {
//         handleReset();
//         openWelcomeModal();
//     };
//
//     // 중간지점으로 이동하는 함수
//     const navigateToMeetingPoint = () => {
//         if (map && meetingPointInfo) {
//             const centerPoint = new naver.maps.LatLng(meetingPointInfo.lat, meetingPointInfo.lng);
//             map.setCenter(centerPoint);
//             map.setZoom(16);
//         }
//     };
//
//     // 외부에서 사용할 모든 데이터와 함수들 반환
//     return {
//         // 모달 상태
//         show: {
//             welcome: showWelcomeModal,
//             meetupSetup: showMeetupSetupModal,
//             search: showSearchModal
//         },
//
//         // 모달 제어 함수들
//         openModal: {
//             welcome: openWelcomeModal,
//             meetupSetup: openMeetupSetupModal,
//             search: openSearchModal
//         },
//         closeModal: {
//             welcome: closeWelcomeModal,
//             meetupSetup: closeMeetupSetupModal,
//             search: closeSearchModal
//         },
//
//         // 주요 동작 함수들
//         handlers: {
//             handleStart,
//             handleSearchAddress,
//             handleCloseMeetupSetup,
//             handleSelectAddress,
//             handleFindMeetingPoint,
//             handleReset,
//             handleNewSearch,
//             navigateToMeetingPoint
//         },
//
//         // 친구 데이터와 관리 함수들
//         friends: {
//             data: friends,
//             updateFriend,
//             addFriend,
//             removeFriend
//         },
//
//         // 현재 검색중인 친구 ID
//         currentFriendId,
//
//         // 지도와 마커 정보
//         map: {
//             instance: map,
//             setMap,
//             markers,
//             setMarkers
//         },
//
//         // 중간지점 정보
//         meetingPointInfo
//     };
// };