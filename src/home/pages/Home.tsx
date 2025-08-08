import React, {useEffect, useRef} from "react";
import {useModal} from "../hooks/useModal.ts";
import {useGeolocation} from "../hooks/useGeolocation.ts";
import WelcomeModal from "../components/modals/WelcomeModal.tsx";
import MeetupSetupModal from "../components/modals/MeetupSetupModal.tsx";
import AddressSearchModal from "../components/modals/AddressSearchModal.tsx";
import NearbyPlacesPanel from "../components/panel/NearbyPlacesPanel.tsx";

const Home: React.FC = () => {
    const {
        show,
        closeModal,
        handlers,
        friends,
        map,
        meetingPointInfo,
        nearbyPlaces,
        handleOpenUrl
    } = useModal();
    const {getCurrentLocationAddress} = useGeolocation();
    const welcomeModalShown = useRef(false);

    // 주변 장소 클릭 핸들러
    const handlePlaceClick = (place: any, type: 'subway' | 'restaurant' | 'cafe') => {
        if (!map.instance) return;

        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        const position = new window.kakao.maps.LatLng(lat, lng);

        // 지도 중심을 클릭한 장소로 이동
        map.instance.setCenter(position);
        map.instance.setLevel(3);

        // 장소 정보 로그 (실제로는 InfoWindow나 마커 표시 가능)
        console.log(`${type} 클릭:`, place.place_name, `(${place.address_name})`);
    };

    // 탭 변경 핸들러
    const handleTabChange = (tab: 'subway' | 'restaurant' | 'cafe') => {
        handlers.filterNearbyMarkers(tab);
    };

    useEffect(() => {
        if (window.kakao?.maps && !map.instance) {
            const mapContainer = document.getElementById('map')!;
            const mapInstance = new window.kakao.maps.Map(mapContainer, {
                center: new window.kakao.maps.LatLng(37.5666805, 126.9784147),
                level: 4,
            });
            map.setMap(mapInstance);
            
            // 지도 로드 완료 후 웰컴 모달 표시 (네이버와 동일한 방식)
            if (!welcomeModalShown.current) {
                welcomeModalShown.current = true;
                setTimeout(() => {
                    handlers.handleNewSearch();
                }, 300);
            }
        }
    }, [map, handlers]);
    return (
        <>
            {show.welcome && (
                <WelcomeModal
                    closeWelcomeModal={closeModal.welcome}
                    onStart={handlers.handleStart}
                />
            )}
            {show.meetupSetup && (
                <MeetupSetupModal
                    friends={friends.data}
                    onClose={handlers.handleCloseMeetupSetup}
                    onSearchAddress={handlers.handleSearchAddress}
                    onUpdateFriend={friends.updateFriend}
                    onAddFriend={friends.addFriend}
                    onRemoveFriend={friends.removeFriend}
                    onFindMeetingPoint={handlers.handleFindMeetingPoint}
                />
            )}
            {show.search && (
                <AddressSearchModal
                    closeModal={closeModal.search}
                    onSelectAddress={handlers.handleSelectAddress}
                />
            )}
            <div className="w-full h-full relative">
                <div
                    id="map"
                    className="w-full h-full"
                />
                
                {/* 플로팅 버튼들 - 항상 표시 */}
                <div className="fixed top-1/2 right-4 z-50 flex flex-col gap-3 transform -translate-y-1/2">
                    <button
                        onClick={handlers.handleNewSearch}
                        className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer"
                        title="모임 장소 찾기"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <div
                            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            모임 장소 찾기
                        </div>
                    </button>

                    <button
                        onClick={handlers.handleReset}
                        className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-rotate-3 cursor-pointer"
                        title="지도 및 데이터 초기화"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-2xl">🔄</span>
                        </div>
                        <div
                            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            초기화
                        </div>
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                // 현재 위치 가져오기 (네이버와 동일한 방식)
                                const result = await getCurrentLocationAddress();

                                // 첫 번째 친구 주소에 현재 위치 설정
                                if (friends.data.length > 0) {
                                    friends.updateFriend(friends.data[0].id, 'address', result.address);
                                }

                                // 지도를 현재 위치로 이동
                                if (map.instance) {
                                    const position = new window.kakao.maps.LatLng(result.latitude, result.longitude);
                                    map.instance.setCenter(position);
                                    map.instance.setLevel(4);
                                }
                            } catch (error) {
                                if (error instanceof Error) {
                                    alert('현재 위치를 가져올 수 없습니다: ' + error.message);
                                }
                            }
                        }}
                        className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer"
                        title="현재 위치로 이동"
                    >
                        <div className="flex items-center justify-center">
                            <span className="text-2xl">🏠</span>
                        </div>
                        <div
                            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            현재 위치
                        </div>
                    </button>
                </div>
                
                {/* 중간지점 정보 표시 - 하단 중앙 */}
                {meetingPointInfo && (
                    <div className="fixed bottom-30 left-1/2 transform -translate-x-1/2 z-40">
                        <button
                            onClick={() => {
                                if (map.instance) {
                                    const centerPosition = new window.kakao.maps.LatLng(
                                        meetingPointInfo.meetingCenterPoint.lat, 
                                        meetingPointInfo.meetingCenterPoint.lng
                                    );
                                    map.instance.setCenter(centerPosition);
                                    map.instance.setLevel(5);
                                }
                            }}
                            className="group bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-2xl border-2 border-white/50 hover:bg-white/95 hover:shadow-3xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <span className="text-lg">📍</span>
                                <span>
                                    {meetingPointInfo.meetingCenterPoint.participantCount}명의 친구 + 중간지점이 표시됨
                                </span>
                                <span className="animate-pulse text-green-500">●</span>
                            </div>
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                클릭하여 중간지점으로 이동
                            </div>
                        </button>
                    </div>
                )}

                {/* 주변 정보 패널 - 중간지점이 설정되었을 때만 토글 버튼 표시 */}
                {meetingPointInfo && (
                    <NearbyPlacesPanel
                        nearbyPlaces={nearbyPlaces}
                        isOpen={show.nearbyPanel}
                        onToggle={handlers.toggleNearbyPanel}
                        onPlaceClick={handlePlaceClick}
                        onTabChange={handleTabChange}
                        handleOpenUrl={handleOpenUrl}
                    />
                )}
            </div>
        </>
    );

}
export default Home;