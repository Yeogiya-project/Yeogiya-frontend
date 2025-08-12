import { apiClient } from "../shared/utils/api/Api.tsx";

// 백엔드 응답 타입
export interface CardPlayResponse {
    userCards: Record<string, number>; // { "user1": 11, "user2": 3, ... }
    winner: string;                    // "user3"
    playedAt: string;                  // "2025-08-12T11:58:29.312"
}

// 카드 게임 플레이 요청
export async function playCardGame(participants: string[]): Promise<CardPlayResponse> {
    return apiClient.post<CardPlayResponse, { participants: string[] }>("/games/card/play", { participants });
}