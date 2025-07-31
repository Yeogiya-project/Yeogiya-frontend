export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

// 네이버 지도 API 타입 정의
export interface NaverMapArea {
    name: string;
    coords?: {
        center: {
            crs: string;
            x: number;
            y: number;
        };
    };
}

export interface NaverMapLand {
    type?: string;
    number1: string;
    number2?: string;
    name: string;
    addition0?: { type: string; value: string; };
    addition1?: { type: string; value: string; };
    addition2?: { type: string; value: string; };
    addition3?: { type: string; value: string; };
    addition4?: { type: string; value: string; };
    coords?: {
        center: {
            crs: string;
            x: number;
            y: number;
        };
    };
}

export interface NaverMapRegion {
    area0: NaverMapArea;
    area1: NaverMapArea;
    area2: NaverMapArea;
    area3: NaverMapArea;
    area4: NaverMapArea;
}

export interface NaverReverseGeocodeResult {
    name: string;
    code: {
        id: string;
        type: string;
        mappingId: string;
    };
    region: NaverMapRegion;
    land?: NaverMapLand;
}

export interface NaverGeocodeAddress {
    roadAddress?: string;
    jibunAddress?: string;
    englishAddress?: string;
    x: string;
    y: string;
    distance: number;
}

export interface NaverGeocodeResponse {
    v2: {
        meta: {
            totalCount: number;
            page: number;
            count: number;
        };
        addresses: NaverGeocodeAddress[];
    };
}