import { apiClient } from "../shared/utils/api/Api.tsx";

export interface RoulettePlayResponse {
    userSpins: Record<string, number>;
    winners: string[];
    playedAt: string;
}

export async function playRouletteGame(userIds: string[]): Promise<RoulettePlayResponse>{
    return apiClient.post<RoulettePlayResponse, string[]>("/games/roulette/play", userIds);
}