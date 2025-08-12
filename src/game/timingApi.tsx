import { apiClient } from "../shared/utils/api/Api.tsx";

export interface TimingPlayRequest {
    userTimings: Record<string, number>;
}

export interface TimingPlayResponse {
    winners: string[];
    winningTime: number;
    playedAt: string;
}

export async function playTimingGame(payload: TimingPlayRequest): Promise<TimingPlayResponse> {
    return apiClient.post<TimingPlayResponse, TimingPlayRequest>("game/timing/play", payload);
}