import React, {useState} from 'react';

interface NearbyPlace {
    id?: string;
    place_name: string;
    category_name?: string;
    address_name: string;
    road_address_name?: string;
    phone?: string;
    x: string; // 경도
    y: string; // 위도
    distance?: string;
    place_url?: string;
}

interface NearbyPlacesPanelProps {
    nearbyPlaces: {
        subways: NearbyPlace[];
        restaurants: NearbyPlace[];
        cafes: NearbyPlace[];
        loading: boolean;
    };
    isOpen: boolean;
    onToggle: () => void;
    onPlaceClick: (place: NearbyPlace, type: 'subway' | 'restaurant' | 'cafe') => void;
    onTabChange: (tab: 'subway' | 'restaurant' | 'cafe') => void;
    handleOpenUrl: (url?: string) => void;
}

const NearbyPlacesPanel: React.FC<NearbyPlacesPanelProps> = ({
                                                                 nearbyPlaces,
                                                                 isOpen,
                                                                 onToggle,
                                                                 onPlaceClick,
                                                                 onTabChange,
                                                                 handleOpenUrl
                                                             }) => {
    const [activeTab, setActiveTab] = useState<'subway' | 'restaurant' | 'cafe'>('subway');

    const formatDistance = (distance?: string) => {
        if (!distance) return '';
        const meters = parseInt(distance);
        if (meters < 1000) {
            return `${meters}m`;
        } else {
            return `${(meters / 1000).toFixed(1)}km`;
        }
    };

    const getCategoryIcon = (category: 'subway' | 'restaurant' | 'cafe') => {
        switch (category) {
            case 'subway':
                return '🚇';
            case 'restaurant':
                return '🍽️';
            case 'cafe':
                return '☕';
            default:
                return '📍';
        }
    };

    const getCategoryName = (category: 'subway' | 'restaurant' | 'cafe') => {
        switch (category) {
            case 'subway':
                return '지하철역';
            case 'restaurant':
                return '음식점';
            case 'cafe':
                return '카페';
            default:
                return '장소';
        }
    };

    const getCategoryColor = (category: 'subway' | 'restaurant' | 'cafe') => {
        switch (category) {
            case 'subway':
                return 'from-blue-500 to-indigo-500';
            case 'restaurant':
                return 'from-orange-500 to-red-500';
            case 'cafe':
                return 'from-amber-500 to-yellow-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const renderPlaceList = (places: NearbyPlace[], type: 'subway' | 'restaurant' | 'cafe') => {
        if (places.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">😔</div>
                    <div className="text-gray-500">주변에 {getCategoryName(type)}이 없습니다</div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {places.map((place, index) => (
                    <div
                        key={place.id || index}
                        onClick={() => onPlaceClick(place, type)}
                        className="group relative bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-gray-200/60 hover:border-blue-300/80 hover:bg-white/95 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl"
                    >
                        {/* 카드 배경 그라데이션 */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(type)} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                        <div className="relative flex items-start gap-4">
                            {/* 순번 아이콘 */}
                            <div
                                className={`relative w-7 h-7 bg-gradient-to-br ${getCategoryColor(type)} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {index + 1}
                                <div
                                    className={`absolute -inset-1 bg-gradient-to-r ${getCategoryColor(type)} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* 장소명 */}
                                <div
                                    className="font-bold text-gray-800 text-base mb-2 truncate group-hover:text-blue-700 transition-colors duration-200">
                                    {place.place_name}
                                </div>

                                {/* 주소 정보 */}
                                <div className="space-y-1.5">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-blue-500 mt-0.5">📍</span>
                                        <span className="flex-1">{place.address_name}</span>
                                    </div>

                                    {place.road_address_name && (
                                        <div className="flex items-start gap-2 text-sm text-gray-500">
                                            <span className="text-green-500 mt-0.5">🛣️</span>
                                            <span className="flex-1">{place.road_address_name}</span>
                                        </div>
                                    )}

                                    {place.phone && (
                                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                                            <span>📞</span>
                                            <span>{place.phone}</span>
                                        </div>
                                    )}

                                    {place.place_url && (
                                        <div className="flex items-start gap-2 text-sm text-gray-500">
                                            <span className="text-green-500 mt-0.5">🔗</span>
                                            <span className="flex-1 cursor-pointer hover:underline break-all"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenUrl(place.place_url);
                                                  }}>{place.place_url}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 오른쪽 정보 */}
                            <div className="flex flex-col items-end gap-2">
                                {place.distance && (
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-md">
                                        {formatDistance(place.distance)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* 토글 버튼 - 개선된 디자인 */}
            <div className={`fixed left-8 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
                isOpen ? 'translate-x-80' : ''
            }`}>
                <button
                    onClick={onToggle}
                    className="group relative bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center p-2 min-h-[80px] w-16 cursor-pointer"
                >
                    {/* 아이콘 */}
                    <div
                        className="text-2xl mb-1 transition-all duration-300 group-hover:scale-110 text-blue-500">
                        🔍
                    </div>

                    {/* 텍스트 */}
                    <div className="text-xs font-medium text-center leading-tight">
                        <div>주변</div>
                        <div>정보</div>
                    </div>

                    {/* 배경 글로우 효과 */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>

            {/* 메인 패널 - 개선된 디자인 */}
            <div
                className={`fixed top-16 bottom-17 w-96 bg-white/98 backdrop-blur-xl shadow-2xl border border-gray-200/60 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } overflow-hidden`}>

                {/* 헤더 - 개선된 디자인 */}
                <div
                    className="relative p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100">
                    {/* 배경 장식 */}
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>

                    <div className="relative flex items-center gap-3 mb-4">
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">주변
                                정보</h3>
                            <p className="text-sm text-gray-600">중간지점 근처 추천 장소</p>
                        </div>
                    </div>

                    {/* 탭 버튼들 - 개선된 디자인 */}
                    <div className="relative flex gap-2 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl shadow-inner">
                        {(['subway', 'restaurant', 'cafe'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    onTabChange(tab);
                                }}
                                className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform cursor-pointer ${
                                    activeTab === tab
                                        ? `bg-gradient-to-r ${getCategoryColor(tab)} text-white shadow-lg scale-105 z-10`
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 hover:shadow-md'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <span className="text-lg">{getCategoryIcon(tab)}</span>
                                    <span className="text-xs leading-tight">{getCategoryName(tab)}</span>
                                    {activeTab === tab && (
                                        <div
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 컨텐츠 - 개선된 디자인 */}
                <div className="flex-1 overflow-y-auto p-2 bg-gradient-to-b from-gray-50/30 to-white/30">
                    {nearbyPlaces.loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-2">검색중입니다...</div>
                            <div className="text-xs text-gray-500">잠시만 기다려주세요</div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'subway' && renderPlaceList(nearbyPlaces.subways, 'subway')}
                            {activeTab === 'restaurant' && renderPlaceList(nearbyPlaces.restaurants, 'restaurant')}
                            {activeTab === 'cafe' && renderPlaceList(nearbyPlaces.cafes, 'cafe')}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default NearbyPlacesPanel;