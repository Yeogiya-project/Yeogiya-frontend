import {useState} from 'react';
import type {AddressResult} from "../types/home";
import {apiClient} from '../utils/api/Api';

export const useAddressSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // 백엔드 API 응답을 AddressResult 형태로 변환
    const convertBackendToAddressResult = (response: { total: number; items: Array<{ title: string; category?: string; address: string; roadAddress?: string; mapX: string; mapY: string; distance?: string | null; }> }): AddressResult[] => {
        return response.items.map((item) => ({
            title: item.title.replace(/<\/?b>/g, ''), // HTML 태그 제거 (백엔드에서 올 수 있음)
            category: item.category || '',
            address: item.address || '',
            roadAddress: item.roadAddress || '',
            mapX: item.mapX,
            mapY: item.mapY
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
            // 백엔드 API를 통해 주소 검색
            const response = await apiClient.searchAddress(searchTerm);
            
            if (!response.items || response.items.length === 0) {
                throw new Error('검색 결과가 없습니다.');
            }

            const results = convertBackendToAddressResult(response);
            setSearchResults(results);
            setTotalCount(response.total);

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