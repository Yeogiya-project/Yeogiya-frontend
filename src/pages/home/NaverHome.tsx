// import React, {useEffect, useRef} from "react";
// import AddressSearchModal from "../../components/modals/home/naver/AddressSearchModal.tsx";
// import WelcomeModal from "../../components/modals/home/naver/WelcomeModal.tsx";
// import MeetupSetupModal from "../../components/modals/home/naver/MeetupSetupModal.tsx";
// import {useModal} from "../../hooks/home/naver/useModal.ts";
// import {useGeolocation} from "../../hooks/home/naver/useGeolocation.ts";
//
// const NaverHome: React.FC = () => {
//     const {
//         show,
//         closeModal,
//         handlers,
//         friends,
//         map,
//         meetingPointInfo
//     } = useModal();
//     const {getCurrentLocationAddress} = useGeolocation();
//     const welcomeModalShown = useRef(false);
//
//     useEffect(() => {
//         if (window.naver?.maps && !map.instance) {
//             const mapInstance = new window.naver.maps.Map('map', {
//                 center: new window.naver.maps.LatLng(37.5666805, 126.9784147), // 서울 시청
//                 zoom: 16,
//                 mapTypeControl: false,
//                 zoomControl: false,
//                 logoControl: false,
//                 scaleControl: false
//             });
//
//             map.setMap(mapInstance);
//
//             naver.maps.Event.addListener(mapInstance, 'tilesloaded', function () {
//                 if (!welcomeModalShown.current) {
//                     welcomeModalShown.current = true;
//                     setTimeout(() => {
//                         handlers.handleNewSearch();
//                     }, 300);
//                 }
//             });
//         }
//     }, [map, handlers]);
//
//     // 현재 위치 버튼을 클릭했을 때 실행되는 간단한 함수
//     const handleCurrentLocation = async () => {
//         try {
//             // 현재 위치 가져오기
//             const result = await getCurrentLocationAddress();
//
//             // 첫 번째 친구 주소에 현재 위치 설정
//             if (friends.data.length > 0) {
//                 friends.updateFriend(friends.data[0].id, 'address', result.address);
//             }
//
//             // 지도를 현재 위치로 이동
//             if (map.instance) {
//                 const position = new naver.maps.LatLng(result.latitude, result.longitude);
//                 map.instance.setCenter(position);
//                 map.instance.setZoom(16);
//             }
//         } catch (error) {
//             if (error instanceof Error) {
//                 alert('현재 위치를 가져올 수 없습니다: ' + error.message);
//             }
//         }
//     };
//
//     return (
//         <>
//             {show.welcome && (
//                 <WelcomeModal
//                     closeWelcomeModal={closeModal.welcome}
//                     onStart={handlers.handleStart}
//                 />
//             )}
//             {show.meetupSetup && (
//                 <MeetupSetupModal
//                     friends={friends.data}
//                     onClose={handlers.handleCloseMeetupSetup}
//                     onSearchAddress={handlers.handleSearchAddress}
//                     onUpdateFriend={friends.updateFriend}
//                     onAddFriend={friends.addFriend}
//                     onRemoveFriend={friends.removeFriend}
//                     onFindMeetingPoint={handlers.handleFindMeetingPoint}
//                 />
//             )}
//             {show.search && (
//                 <AddressSearchModal
//                     closeModal={closeModal.search}
//                     onSelectAddress={handlers.handleSelectAddress}
//                 />
//             )}
//
//             <div className="fixed top-1/2 right-4 z-40 flex flex-col gap-3 transform -translate-y-1/2">
//                 <button
//                     onClick={handlers.handleNewSearch}
//                     className="group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
//                     title="모임 장소 찾기"
//                 >
//                     <div className="flex items-center justify-center">
//                         <span className="text-2xl">🔍</span>
//                     </div>
//                     <div
//                         className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                         모임 장소 찾기
//                     </div>
//                 </button>
//
//                 <button
//                     onClick={handlers.handleReset}
//                     className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-rotate-3"
//                     title="지도 및 데이터 초기화"
//                 >
//                     <div className="flex items-center justify-center">
//                         <span className="text-2xl">🔄</span>
//                     </div>
//                     <div
//                         className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                         초기화
//                     </div>
//                 </button>
//
//                 <button
//                     onClick={handleCurrentLocation}
//                     className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
//                     title="현재 위치로 이동"
//                 >
//                     <div className="flex items-center justify-center">
//                         <span className="text-2xl">🏠</span>
//                     </div>
//                     <div
//                         className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                         현재 위치
//                     </div>
//                 </button>
//
//             </div>
//
//             {meetingPointInfo && (
//                 <div className="fixed bottom-25 left-1/2 transform -translate-x-1/2 z-40">
//                     <button
//                         onClick={handlers.navigateToMeetingPoint}
//                         className="group bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-2xl border-2 border-white/50 hover:bg-white/95 hover:shadow-3xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
//                     >
//                         <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                             <span className="text-lg">📍</span>
//                             <span>
//                                 {meetingPointInfo.friendCount}명의 친구 + 중간지점이 표시됨
//                             </span>
//                             <span className="animate-pulse text-green-500">●</span>
//                         </div>
//                         <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                             클릭하여 중간지점으로 이동
//                         </div>
//                     </button>
//                 </div>
//             )}
//
//             <div className="w-full h-full">
//                 <div
//                     id="map"
//                     className="w-full h-full"
//                 />
//             </div>
//         </>
//     );
// }
//
// export default NaverHome;