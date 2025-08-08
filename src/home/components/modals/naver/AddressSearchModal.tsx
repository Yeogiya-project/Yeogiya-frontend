// import React from "react";
// import {useAddressSearch} from "../../../../hooks/home/kakao/useAddressSearch.ts";
// import {useGeolocation} from "../../../../hooks/home/naver/useGeolocation.ts";
// import type {AddressResult} from "../../../../types/home/home.ts";
//
// interface AddressSearchModalProps {
//     closeModal: () => void;
//     onSelectAddress: (address: string) => void;
// }
//
// const AddressSearchModal: React.FC<AddressSearchModalProps> = ({closeModal, onSelectAddress}) => {
//     const {
//         searchKeyword,
//         searchResults,
//         loading,
//         totalCount,
//         handleSearch,
//         handleKeywordChange,
//         handleKeyUp
//     } = useAddressSearch();
//
//     const {loading: gettingLocation, getCurrentLocationAddress} = useGeolocation();
//
//     const handleSelectAddress = (address: AddressResult) => {
//         const fullAddress = address.roadAddress || address.address;
//         onSelectAddress(fullAddress);
//         closeModal();
//     };
//
//     // 현재 위치 사용하기 버튼을 클릭했을 때 실행되는 간단한 함수
//     const handleGetCurrentLocation = async () => {
//         try {
//             const result = await getCurrentLocationAddress();
//             onSelectAddress(result.address);  // 주소만 전달
//             closeModal();
//         } catch (error) {
//             if (error instanceof Error) {
//                 alert('현재 위치를 가져올 수 없습니다: ' + error.message);
//             }
//         }
//     };
//
//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4"
//              onClick={closeModal}>
//             <div
//                 className="bg-white/95 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-white/20 flex flex-col"
//                 onClick={(e) => e.stopPropagation()}>
//                 {/* 헤더 */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-100">
//                     <div className="flex items-center gap-3">
//                         <div
//                             className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
//                             <span className="text-white text-xl">🔍</span>
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                                 주소 검색
//                             </h2>
//                         </div>
//                     </div>
//                     <button
//                         onClick={closeModal}
//                         className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
//                     >
//                         <span className="text-xl">×</span>
//                     </button>
//                 </div>
//
//                 {/* 검색 입력 */}
//                 <div className="px-6 py-4 border-b border-gray-100">
//                     <div className="space-y-3">
//                         <input
//                             type="text"
//                             value={searchKeyword}
//                             onChange={(e) => handleKeywordChange(e.target.value)}
//                             onKeyUp={handleKeyUp}
//                             placeholder="어디서 만날까요? (예: 강남역, 홍대입구역)"
//                             className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500 text-lg"
//                         />
//                         <button
//                             onClick={() => handleSearch()}
//                             disabled={loading}
//                             className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//                         >
//                             {loading ? (
//                                 <>
//                                     <div
//                                         className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
//                                     검색중...
//                                 </>
//                             ) : (
//                                 <>
//                                     <span className="text-xl mr-2">🔍</span>
//                                     주소 검색하기
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                     <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
//                         <span className="text-purple-500">💡</span>
//                         <span>지역명, 건물명, 지하철역명 등으로 검색해보세요</span>
//                     </div>
//                 </div>
//
//                 {/* 검색 결과 */}
//                 <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
//                     {/* 현재 위치 버튼 */}
//                     <div className="mb-6">
//                         <button
//                             onClick={handleGetCurrentLocation}
//                             disabled={gettingLocation}
//                             className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${
//                                 gettingLocation
//                                     ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
//                                     : 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 hover:border-emerald-400 transform hover:scale-[1.02]'
//                             }`}
//                         >
//                             {gettingLocation ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
//                                     <span className="text-lg font-semibold">현재 위치를 가져오는 중...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <div
//                                         className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
//                                         📍
//                                     </div>
//                                     <div className="text-left">
//                                         <div className="text-lg font-bold text-emerald-700">현재 위치 사용하기</div>
//                                         <div className="text-sm text-emerald-600">GPS를 사용해서 내 위치를 자동으로 설정합니다</div>
//                                     </div>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//
//                     {loading ? (
//                         <div className="flex flex-col items-center justify-center py-12">
//                             <div
//                                 className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//                             </div>
//                             <div className="text-lg font-semibold text-gray-700 mb-2">검색중입니다...</div>
//                             <div className="text-sm text-gray-500">잠시만 기다려주세요</div>
//                         </div>
//                     ) : searchResults.length > 0 ? (
//                         <>
//                             <div className="space-y-4">
//                                 {searchResults.map((result, index) => (
//                                     <div
//                                         key={index}
//                                         onClick={() => handleSelectAddress(result)}
//                                         className="group bg-white/80 backdrop-blur-sm p-5 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
//                                     >
//                                         <div className="flex items-start gap-4">
//                                             <div
//                                                 className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
//                                                 {index + 1}
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <div
//                                                     className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-700 transition-colors duration-200"
//                                                     dangerouslySetInnerHTML={{__html: result.title}}>
//                                                 </div>
//                                                 {result.roadAddress && (
//                                                     <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                                                         <span
//                                                             className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">📍 도로명</span>
//                                                         <span>{result.roadAddress}</span>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                                                     <span
//                                                         className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">🏠 지번</span>
//                                                     <span>{result.address}</span>
//                                                 </div>
//                                             </div>
//                                             <div
//                                                 className="flex items-center justify-center w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-full transition-colors duration-200">
//                                                 <span className="text-purple-600 text-xl">→</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </>
//                     ) : searchKeyword && !loading ? (
//                         <div className="text-center py-3">
//                             <div
//                                 className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                                 <span className="text-3xl">😔</span>
//                             </div>
//                             <div className="text-xl font-bold text-gray-700 mb-3">검색 결과가 없어요</div>
//                             <div className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
//                                 &apos;<span className="font-semibold text-gray-700">{searchKeyword}</span>&apos;에 대한 결과를
//                                 찾을 수 없습니다
//                             </div>
//                             <div
//                                 className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 max-w-md mx-auto">
//                                 <div className="flex items-center gap-2 text-blue-700 mb-2">
//                                     <span className="text-lg">💡</span>
//                                     <span className="font-semibold">검색 팁</span>
//                                 </div>
//                                 <ul className="text-sm text-blue-600 space-y-1 text-left">
//                                     <li>• 지역명으로 검색해보세요 (예: 강남, 홍대, 건대)</li>
//                                     <li>• 지하철역명을 입력해보세요 (예: 강남역, 홍대입구역)</li>
//                                     <li>• 건물명이나 랜드마크를 검색해보세요</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <div
//                                 className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
//                                 <span className="text-3xl">🔍</span>
//                             </div>
//                             <div className="text-xl font-bold text-gray-700 mb-3">어디서 만날까요?</div>
//                             <div className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
//                                 위의 검색창에 만나고 싶은 장소를 입력해보세요
//                             </div>
//                             <div
//                                 className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 max-w-md mx-auto">
//                                 <div className="flex items-center gap-2 text-emerald-700 mb-2">
//                                     <span className="text-lg">✨</span>
//                                     <span className="font-semibold">추천 검색어</span>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2 justify-center">
//                                     {['강남역', '홍대입구역', '건대입구역', '명동', '이태원'].map((keyword, index) => (
//                                         <button
//                                             key={index}
//                                             onClick={() => {
//                                                 handleKeywordChange(keyword);
//                                                 handleSearch(keyword);
//                                             }}
//                                             className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-medium rounded-full transition-colors duration-200 transform hover:scale-105"
//                                         >
//                                             {keyword}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default AddressSearchModal;