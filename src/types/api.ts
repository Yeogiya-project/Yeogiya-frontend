export interface BackendAddressSearchResponse {
    total: number;
    items: Array<{
        title: string;
        category?: string;
        address: string;
        roadAddress?: string;
        mapX: string;
        mapY: string;
        distance?: string | null;
    }>;
}
