import { useState } from 'react';
import type { AddressResult } from "../types/home";
import { geocode } from '../utils/naverMapUtils';
import type { NaverGeocodeResponse } from '../types/geolocation';

export const useAddressSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // 네이버 지도 API 응답을 AddressResult 형태로 변환
    const convertToAddressResult = (response: NaverGeocodeResponse): AddressResult[] => {
        return response.v2.addresses.map((address, index) => ({
            title: `검색결과 ${index + 1}`,
            category: '',
            address: address.jibunAddress || '',
            roadAddress: address.roadAddress || '',
            mapX: address.x,
            mapY: address.y
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
            const response = await geocode(searchTerm);
            const results = convertToAddressResult(response);
            
            setSearchResults(results);
            setTotalCount(response.v2.meta.totalCount);
            
            console.log(`검색어: ${searchTerm}, 결과: ${results.length}개`);
            
        } catch (error) {
            console.error('주소 검색 오류:', error);
            
            const errorMessage = error instanceof Error 
                ? error.message 
                : '주소 검색 중 오류가 발생했습니다.';
            
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