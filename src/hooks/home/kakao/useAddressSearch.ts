import {useState} from 'react';
import type {AddressResult} from "../../../types/home/home.ts";
import {kakaoApi} from '../../../utils/api/kakao/KakaoApi.tsx';

export const useAddressSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const handleSearch = async (keyword?: string) => {
        const searchTerm = keyword || searchKeyword;

        if (!searchTerm.trim()) {
            setError('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await kakaoApi.searchPlaces(searchTerm, "KEYWORD");
            
            setSearchResults(response);
            console.log('검색 결과:', response);

        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '검색 중 오류가 발생했습니다.';

            setError(errorMessage);
            setSearchResults(null);
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
        setSearchResults(null);
        setError(null);
    };

    return {
        searchKeyword,
        searchResults,
        loading,
        error,
        handleSearch,
        handleKeywordChange,
        handleKeyUp,
        clearSearch
    };
};