// 네이버 지도 API 타입 정의

export interface NaverMapsOptions {
    center: naver.maps.LatLng;
    zoom: number;
    mapTypeControl?: boolean;
    zoomControl?: boolean;
    logoControl?: boolean;
    scaleControl?: boolean;
}

export interface NaverMarkerOptions {
    position: naver.maps.LatLng;
    map: naver.maps.Map | null;
    icon?: {
        content: string;
        anchor: naver.maps.Point;
    };
}

export interface NaverGeocodeOptions {
    query: string;
}

export interface NaverReverseGeocodeOptions {
    coords: naver.maps.LatLng;
    orders: string;
}

export interface NaverSearchOptions {
    query: string;
    type: string;
}

export interface NaverServiceCallback<T = unknown> {
    (status: string, response: T): void;
}

export interface NaverSearchResult {
    result: {
        total: number;
        items: Array<{
            title: string;
            category: string;
            address: string;
            roadAddress: string;
            mapx: string;
            mapy: string;
            distance?: string;
        }>;
    };
}

declare global {
    interface Window {
        naver?: {
            maps: {
                Map: new (element: string | HTMLElement, options: NaverMapsOptions) => naver.maps.Map;
                LatLng: new (lat: number, lng: number) => naver.maps.LatLng;
                LatLngBounds: new () => naver.maps.LatLngBounds;
                Marker: new (options: NaverMarkerOptions) => naver.maps.Marker;
                Point: new (x: number, y: number) => naver.maps.Point;
                Event: {
                    addListener: (target: unknown, type: string, listener: (...args: unknown[]) => void) => unknown;
                };
                Service: {
                    Status: {
                        ERROR: string;
                    };
                    OrderType: {
                        ADDR: string;
                        ROAD_ADDR: string;
                    };
                    SearchType: {
                        PLACE: string;
                    };
                    reverseGeocode: (options: NaverReverseGeocodeOptions, callback: NaverServiceCallback<unknown>) => void;
                    geocode: (options: NaverGeocodeOptions, callback: NaverServiceCallback<unknown>) => void;
                    search: (options: NaverSearchOptions, callback: NaverServiceCallback<NaverSearchResult>) => void;
                };
            };
        };
    }

    namespace naver {
        namespace maps {
            class Map {
                constructor(element: string | HTMLElement, options: NaverMapsOptions);
                setCenter(latlng: LatLng): void;
                setZoom(zoom: number): void;
                fitBounds(bounds: LatLngBounds, options?: { padding: number }): void;
            }

            class LatLng {
                constructor(lat: number, lng: number);
                lat(): number;
                lng(): number;
            }

            class LatLngBounds {
                constructor();
                extend(latlng: LatLng): void;
            }

            class Marker {
                constructor(options: NaverMarkerOptions);
                setMap(map: Map | null): void;
                getElement(): HTMLElement | null;
            }

            class Point {
                constructor(x: number, y: number);
            }

            namespace Event {
                function addListener(target: unknown, type: string, listener: (...args: unknown[]) => void): unknown;
            }

            namespace Service {
                enum Status {
                    ERROR = "ERROR"
                }

                enum OrderType {
                    ADDR = "addr",
                    ROAD_ADDR = "roadaddr"
                }

                enum SearchType {
                    PLACE = "PLACE"
                }

                function reverseGeocode(options: NaverReverseGeocodeOptions, callback: NaverServiceCallback<unknown>): void;
                function geocode(options: NaverGeocodeOptions, callback: NaverServiceCallback<unknown>): void;
                function search(options: NaverSearchOptions, callback: NaverServiceCallback<NaverSearchResult>): void;
            }
        }
    }
}

export {};