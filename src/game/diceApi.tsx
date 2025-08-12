import { apiClient } from "../shared/utils/api/Api.tsx";

// 백엔드 응답 타입
export interface DicePlayResponse {
    id: number;
    gameType: string; // "Dice"
    userResults: Record<string, number>; // { "user1":2, "user2":2, ... }
    winner: string;   // "user3"
    playAt: string;   // "2025-07-31-..."
}

export async function playDiceGame(usernames: string[]): Promise<DicePlayResponse> {
    return apiClient.post<DicePlayResponse, string[]>("/games/dice/play", usernames);
}