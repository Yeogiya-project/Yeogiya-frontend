export interface Friend {
    id: number;
    name: string;
    address: string;
}

export interface AddressResult {
    title: string;
    category?: string;
    address: string;
    roadAddress?: string;
    mapX: string;
    mapY: string;
}