import axios from 'axios';
import type {Restaurant} from '../../types/restaurant';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchRecommendation = async (
    lat: number,
    lng: number,
    keyword: string,
    category: string
): Promise<Restaurant> => {
    try {
        const response = await axios.get<Restaurant>(`${API_BASE_URL}/restaurants/recommend`, {
            params: { lat, lng, keyword, category },
        });
        return response.data;
    } catch (error) {
        console.error("맛집 추천 API 요청 중 에러 발생:", error);
        throw error;
    }
};