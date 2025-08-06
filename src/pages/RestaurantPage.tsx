import React, {useState, useCallback} from 'react';
import axios from 'axios';

import OptionForm from '../components/restaurant/OptionForm';
import ResultCard from '../components/restaurant/ResultCard';
import MapView from '../components/restaurant/MapView';
import {fetchRecommendation} from '../utils/api/restaurantApi';
import {useRestaurantGeolocation} from '../hooks/useRestaurantGeolocation';
import type {Restaurant} from '../types/restaurant';

interface SearchLocation {
    lat: number;
    lng: number;
}

const RestaurantPage: React.FC = () => {
    const [recommendation, setRecommendation] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
    const [isMapClickMode, setIsMapClickMode] = useState<boolean>(false);

    const { loading: geoLoading, getCurrentLocation } = useRestaurantGeolocation();

    const callApi = useCallback(async (lat: number, lng: number, keyword: string, category: string) => {
        setIsLoading(true);
        setApiError(null);
        setIsMapClickMode(false);

        try {
            const result = await fetchRecommendation(lat, lng, keyword, category);
            setRecommendation(result);
            // 추천에 성공하면, 다음 다시 추천을 위해 사용된 위치를 저장
            setSearchLocation({ lat, lng });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setApiError('해당 키워드는 추천할 만한 곳이 안 나와요🥹');
            } else {
                setApiError('잠시 후 다시 시도해 주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRecommend = async (keyword: string, category: string) => {
        // 다시 추천
        if (searchLocation) {
            await callApi(searchLocation.lat, searchLocation.lng, keyword, category);
            return;
        }

        // 처음 추천
        setIsLoading(true);
        setApiError(null);

        try {
            // 먼저 현재 위치를 가져오려고 시도
            const location = await getCurrentLocation();
            // 성공하면, 바로 API를 호출.
            await callApi(location.lat, location.lng, keyword, category);
        } catch (err) {

            // 위치 가져오기를 거부하면, 사용자에게 지도를 클릭하라고 안내하고, '지도 클릭 모드'를 활성화
            setApiError('지도에서 원하는 위치를 선택해 주세요.');
            setIsMapClickMode(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        // '지도 클릭 모드'일 때만, 그리고 키워드를 입력했을 때만 동작하도록 수정.
        const keywordInput = document.getElementById('keyword') as HTMLInputElement;
        if (isMapClickMode && keywordInput?.value) {
            await callApi(lat, lng, keywordInput.value, 'FD6');
        }
    };

    // X 버튼을 눌렀을 때 모든 상태를 깨끗하게 초기화하는 함수
    const handleReset = () => {
        setRecommendation(null);
        setApiError(null);
        setIsMapClickMode(false);
        setSearchLocation(null); // 기억했던 위치 정보도 초기화
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold mb-2">오늘은 여기야</h1>
                <p className="text-xl text-gray-400">결정하기 힘들 땐, 클릭 한 번 해봐!</p>
            </div>

            <OptionForm onRecommend={handleRecommend} loading={isLoading || geoLoading} />

            {(apiError) && (
                <div className="mt-8 text-center bg-red-500/20 text-red-300 p-4 rounded-lg max-w-md">
                    {apiError}
                </div>
            )}

            <ResultCard result={recommendation} onClose={handleReset} />

            <MapView
                recommendedPlace={recommendation}
                onMapClick={handleMapClick}
            />
        </div>
    );
};
export default RestaurantPage;
