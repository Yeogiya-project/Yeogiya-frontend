import { useState } from 'react';

// 타입 정의
interface AddressResult {
    title: string;
    category?: string;
    address: string;
    roadAddress?: string;
    mapX: string;
    mapY: string;
}

export const useAddressSearch = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);

    const handleSearch = async (keyword?: string) => {
        const searchTerm = keyword || searchKeyword;
        
        if (!searchTerm.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // TODO: API 함수 호출로 대체
            // const data = await searchAddresses(searchTerm);
            
            // 임시 더미 데이터 (API 연결 전까지 사용)
            console.log(`검색어: ${searchTerm}`);
            setSearchResults([]);
            setTotalCount(0);
            
        } catch (error) {
            console.error('주소 검색 오류:', error);
            alert('주소 검색 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    const handleKeywordChange = (value: string) => {
        setSearchKeyword(value);
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return {
        searchKeyword,
        searchResults,
        loading,
        totalCount,
        handleSearch,
        handleKeywordChange,
        handleKeyUp
    };
};