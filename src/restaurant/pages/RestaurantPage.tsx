import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';

import OptionForm from '../components/OptionForm';
import ResultCard from '../components/ResultCard';
import MapView from '../components/MapView';
import {useRestaurantGeolocation} from '../hooks/useRestaurantGeolocation';
import { CATEGORY_DATA } from "../constants/categoryData.ts";
import type {Restaurant} from "../types/restaurant.ts";
import { fetchRecommendation } from '../api/restaurantApi.ts';

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

    // 카테고리 상태 관리
    const [mainCategory, setMainCategory] = useState<keyof typeof CATEGORY_DATA>('restaurant');
    const [selectedKeyword, setSelectedKeyword] = useState<string>(CATEGORY_DATA.restaurant.subCategories[0].keyword);

    const { loading: geoLoading, getCurrentLocation } = useRestaurantGeolocation();

    // 메인 카테고리가 바뀔 때마다 선택된 서브 카테고리 키워드를 첫 번째 항목으로 초기화
    useEffect(() => {
       setSelectedKeyword(CATEGORY_DATA[mainCategory].subCategories[0].keyword);
    }, [mainCategory]);

    const callApi = useCallback(async (lat: number, lng: number, keyword: string, categoryCode: string) => {
        setIsLoading(true);
        setApiError(null);
        setIsMapClickMode(false);

        try {
            const result = await fetchRecommendation(lat, lng, keyword, categoryCode);
            setRecommendation(result);
            // 추천에 성공하면, 다음 다시 추천을 위해 사용된 위치를 저장
            setSearchLocation({ lat, lng });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setApiError('해당 키워드는 썩 좋은 결과가 없어요ㅜㅠ');
            } else {
                setApiError('잠시 후 다시 시도해 주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRecommend = async () => {
        const categoryCode = CATEGORY_DATA[mainCategory].categoryCode;

        if (searchLocation) {
            await callApi(searchLocation.lat, searchLocation.lng, selectedKeyword, categoryCode);
            return;
        }

        // 처음 추천
        setIsLoading(true);
        setApiError(null);

        try {
            // 먼저 현재 위치를 가져오려고 시도
            const location = await getCurrentLocation();
            // 성공하면, 바로 API를 호출.
            await callApi(location.lat, location.lng, selectedKeyword, categoryCode);
        } catch (err) {

            // 위치 가져오기를 거부하면, 사용자에게 지도를 클릭하라고 안내하고, '지도 클릭 모드'를 활성화
            setApiError('지도에서 원하는 위치를 선택해 주세요.');
            setIsMapClickMode(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        if (isMapClickMode) {
            const categoryCode = CATEGORY_DATA[mainCategory].categoryCode;
            await callApi(lat, lng, selectedKeyword, categoryCode);
        }
    };

    const handleReset = () => {
        setRecommendation(null);
        setApiError(null);
        setIsMapClickMode(false);
        setSearchLocation(null);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <style>{/* ... */}</style>
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold mb-2">오늘은 여기야</h1>
                <p className="text-xl text-gray-400">결정하기 힘들 땐, 클릭 한 번 해봐!</p>
            </div>

            <OptionForm
                loading={isLoading || geoLoading}
                mainCategory={mainCategory}
                selectedKeyword={selectedKeyword}
                setMainCategory={setMainCategory}
                setSelectedKeyword={setSelectedKeyword}
                onRecommend={handleRecommend}
            />

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
