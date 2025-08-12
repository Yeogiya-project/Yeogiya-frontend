import { apiClient } from "../shared/utils/api/Api.tsx";

export type RpsChoice = "ROCK" | "PAPER" | "SCISSORS";

export type MaybeChoice = RpsChoice | "";

export interface RpsPlayerInput {
    name: string;
    choice: MaybeChoice;
}

export interface RpsPlayResponse {
    draw: boolean;
    winners: string[];
}

export async function playRpsGame(players: RpsPlayerInput[]): Promise<RpsPlayResponse> {
    return apiClient.post<RpsPlayResponse, RpsPlayerInput[]>("/games/rps/play", players);
}