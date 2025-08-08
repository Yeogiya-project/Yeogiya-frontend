// import {useState} from 'react';
// import type {AddressResult} from "../../../types/home/home.ts";
// import {naverApi} from '../../../utils/api/naver/NaverApi.tsx';
// import {useNaverGeocode} from './useNaverGeocode.ts';
//
// export const useAddressSearch = () => {
//     const [searchKeyword, setSearchKeyword] = useState<string>("");
//     const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [totalCount, setTotalCount] = useState<number>(0);
//     const [error, setError] = useState<string | null>(null);
//
//     const { geocodeAddress } = useNaverGeocode();
//
//     // 백엔드 API 응답을 AddressResult 형태로 변환
//     const convertBackendToAddressResult = (response: { total: number; items: Array<{ title: string; category?: string; address: string; roadAddress?: string; mapX: string; mapY: string; distance?: string | null; }> }): AddressResult[] => {
//         return response.items.map((item) => ({
//             title: item.title.replace(/<\/?b>/g, ''), // HTML 태그 제거 (백엔드에서 올 수 있음)
//             category: item.category || '',
//             address: item.address || '',
//             roadAddress: item.roadAddress || '',
//             mapX: item.mapX,
//             mapY: item.mapY
//         }));
//     };
//
//     // 중복 제거 유틸리티 함수
//     const removeDuplicates = (results: AddressResult[]): AddressResult[] => {
//         const uniqueMap = new Map<string, AddressResult>();
//
//         results.forEach(result => {
//             // 좌표나 주소를 기준으로 중복 체크
//             const key = result.mapX && result.mapY
//                 ? `${result.mapX}-${result.mapY}`
//                 : result.address || result.title;
//
//             if (!uniqueMap.has(key)) {
//                 uniqueMap.set(key, result);
//             }
//         });
//
//         return Array.from(uniqueMap.values());
//     };
//
//     const handleSearch = async (keyword?: string) => {
//         const searchTerm = keyword || searchKeyword;
//
//         if (!searchTerm.trim()) {
//             setError('검색어를 입력해주세요.');
//             return;
//         }
//
//         setLoading(true);
//         setError(null);
//
//         try {
//             // 병렬로 두 API 호출
//             const [geocodeResults, searchApiResults] = await Promise.allSettled([
//                 // 1. 지오코딩 (주소 검색)
//                 geocodeAddress(searchTerm),
//
//                 // 2. Search API (장소명 검색)
//                 naverApi.searchAddress(searchTerm)
//                     .then(response => convertBackendToAddressResult(response))
//                     .catch(() => [] as AddressResult[])
//             ]);
//
//             // 결과 합치기
//             const allResults: AddressResult[] = [];
//
//             if (geocodeResults.status === 'fulfilled') {
//                 allResults.push(...geocodeResults.value);
//                 console.log('지오코딩 결과:', geocodeResults.value.length, '개');
//             }
//
//             if (searchApiResults.status === 'fulfilled') {
//                 allResults.push(...searchApiResults.value);
//                 console.log('Search API 결과:', searchApiResults.value.length, '개');
//             }
//
//             if (allResults.length === 0) {
//                 throw new Error('검색 결과가 없습니다.');
//             }
//
//             // 중복 제거
//             const uniqueResults = removeDuplicates(allResults);
//
//             setSearchResults(uniqueResults);
//             setTotalCount(uniqueResults.length);
//             console.log('최종 결과:', uniqueResults.length, '개');
//
//         } catch (error) {
//             const errorMessage = error instanceof Error
//                 ? error.message
//                 : '검색 중 오류가 발생했습니다.';
//
//             setError(errorMessage);
//             setSearchResults([]);
//             setTotalCount(0);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleKeywordChange = (value: string) => {
//         setSearchKeyword(value);
//         // 에러 상태 초기화
//         if (error) {
//             setError(null);
//         }
//     };
//
//     const handleKeyUp = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             handleSearch();
//         }
//     };
//
//     const clearSearch = () => {
//         setSearchKeyword('');
//         setSearchResults([]);
//         setTotalCount(0);
//         setError(null);
//     };
//
//     return {
//         searchKeyword,
//         searchResults,
//         loading,
//         totalCount,
//         error,
//         handleSearch,
//         handleKeywordChange,
//         handleKeyUp,
//         clearSearch
//     };
// };