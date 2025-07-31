import React, {useEffect, useRef} from "react";
import AddressSearchModal from "../components/modals/AddressSearchModal";
import WelcomeModal from "../components/modals/WelcomeModal";
import MeetupSetupModal from "../components/modals/MeetupSetupModal";
import {useModal} from "../hooks/useModal";

const Home: React.FC = () => {
    const {
        show,
        closeModal,
        handlers,
        friends,
        map
    } = useModal();
    const welcomeModalShown = useRef(false);

    useEffect(() => {
        if (window.naver?.maps && !map.instance) {
            const mapInstance = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(37.5666805, 126.9784147), // 서울 시청
                zoom: 10,
                mapTypeControl: false, // 일반/위성 선택 버튼 숨기기
                zoomControl: false,
                logoControl: false, // 네이버 로고도 숨기기
                scaleControl: false // 축척 표시도 숨기기
            });
            
            // 지도 인스턴스를 useModal 훅에 전달
            map.setMap(mapInstance);
            
            // 지도 로드 완료 후 Welcome 모달 자동 열기 (한 번만)
            naver.maps.Event.addListener(mapInstance, 'tilesloaded', function() {
                // tilesloaded 이벤트는 지도 타일이 모두 로드된 후 발생 (idle보다 빠름)
                if (!welcomeModalShown.current) {
                    welcomeModalShown.current = true;
                    setTimeout(() => {
                        handlers.handleNewSearch(); // Welcome 모달 열기
                    }, 300); // 0.3초로 단축
                }
            });
            
        } else if (!window.naver?.maps) {
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
            
            {/* 플로팅 액션 버튼들 */}
            <div className="fixed top-1/2 right-4 z-40 flex flex-col gap-3 transform -translate-y-1/2">
                {/* 다시 검색하기 버튼 (Welcome 모달 열기) */}
                <button
                    onClick={handlers.handleNewSearch}
                    className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
                    title="새로운 검색 시작하기"
                >
                    <div className="flex items-center justify-center">
                        <span className="text-2xl">🔍</span>
                    </div>
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        새로운 검색 🆕
                    </div>
                </button>

                {/* 지도 초기화 버튼 */}
                <button
                    onClick={handlers.handleReset}
                    className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-rotate-3"
                    title="지도 및 데이터 초기화"
                >
                    <div className="flex items-center justify-center">
                        <span className="text-2xl">🔄</span>
                    </div>
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        초기화 ♻️
                    </div>
                </button>

                {/* 현재 위치로 이동 버튼 */}
                <button
                    onClick={() => {
                        if (map.instance) {
                            map.instance.setCenter(new naver.maps.LatLng(37.5666805, 126.9784147));
                            map.instance.setZoom(10);
                        }
                    }}
                    className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
                    title="서울 중심으로 이동"
                >
                    <div className="flex items-center justify-center">
                        <span className="text-2xl">🏠</span>
                    </div>
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        서울 중심 🌆
                    </div>
                </button>
            </div>

            {/* 하단 상태 표시 */}
            {map.markers.length > 0 && (
                <div className="fixed bottom-25 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-2xl border-2 border-white/50">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <span className="text-lg">📍</span>
                            <span>
                                {map.markers.length - 1}명의 친구 + 중간지점이 표시됨
                            </span>
                            <span className="animate-pulse text-green-500">●</span>
                        </div>
                    </div>
                </div>
            )}


            <div className="w-full h-full">
                <div
                    id="map"
                    className="w-full h-full"
                />
            </div>
        </>
    );
}

export default Home;