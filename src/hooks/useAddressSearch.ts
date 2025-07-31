import {useState} from 'react';
import type {AddressResult} from "../types/home";
import {geocode, searchPlaces} from '../utils/naverMapUtils';
import type {NaverGeocodeResponse} from '../types/geolocation';
import type {NaverSearchResult} from '../types/naver-maps';

export const useAddressSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // 네이버 지도 API 응답을 AddressResult 형태로 변환
    const convertToAddressResult = (response: NaverGeocodeResponse, searchTerm: string): AddressResult[] => {
        return response.v2.addresses.map((address) => {
            // 도로명주소가 있으면 우선 사용, 없으면 지번주소 사용
            const mainAddress = address.roadAddress || address.jibunAddress || '';

            // 검색어가 포함된 적절한 제목 생성
            let title = mainAddress;
            if (mainAddress.length > 30) {
                // 주소가 너무 길면 검색어 중심으로 줄임
                const searchIndex = mainAddress.toLowerCase().indexOf(searchTerm.toLowerCase());
                if (searchIndex !== -1) {
                    const start = Math.max(0, searchIndex - 10);
                    const end = Math.min(mainAddress.length, searchIndex + searchTerm.length + 10);
                    title = (start > 0 ? '...' : '') + mainAddress.substring(start, end) + (end < mainAddress.length ? '...' : '');
                } else {
                    title = mainAddress.substring(0, 30) + '...';
                }
            }

            return {
                title: title,
                category: '', // Geocoding API에서는 카테고리 정보 없음
                address: address.jibunAddress || '',
                roadAddress: address.roadAddress || '',
                mapX: address.x,
                mapY: address.y
            };
        });
    };

    // 네이버 Local Search API 응답을 AddressResult 형태로 변환
    const convertPlaceToAddressResult = (response: NaverSearchResult): AddressResult[] => {
        return response.result.items.map((item) => ({
            title: item.title.replace(/<\/?b>/g, ''), // HTML 태그 제거
            category: item.category || '',
            address: item.address || '',
            roadAddress: item.roadAddress || '',
            mapX: item.mapx,
            mapY: item.mapy
        }));
    };

    const handleSearch = async (keyword?: string) => {
        const searchTerm = keyword || searchKeyword;

        if (!searchTerm.trim()) {
            setError('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let results: AddressResult[] = [];
            let totalCount = 0;

            try {
                // 1. 먼저 장소 검색 시도 (강남역, 홍대입구역 등)
                const placeResponse = await searchPlaces(searchTerm);
                results = convertPlaceToAddressResult(placeResponse);
                totalCount = placeResponse.result.total;
            } catch (placeError) {
                try {
                    // 2. 장소 검색 실패 시 주소 검색 시도
                    const geocodeResponse = await geocode(searchTerm);
                    results = convertToAddressResult(geocodeResponse, searchTerm);
                    totalCount = geocodeResponse.v2.meta.totalCount;
                } catch {
                    throw new Error('검색 결과가 없습니다.');
                }
            }

            setSearchResults(results);
            setTotalCount(totalCount);

        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '검색 중 오류가 발생했습니다.';

            setError(errorMessage);
            setSearchResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleKeywordChange = (value: string) => {
        setSearchKeyword(value);
        // 에러 상태 초기화
        if (error) {
            setError(null);
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults([]);
        setTotalCount(0);
        setError(null);
    };

    return {
        searchKeyword,
        searchResults,
        loading,
        totalCount,
        error,
        handleSearch,
        handleKeywordChange,
        handleKeyUp,
        clearSearch
    };
};