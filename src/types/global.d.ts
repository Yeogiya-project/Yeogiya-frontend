interface Window {
    naver: {
        maps: {
            Map: new (element: string | HTMLElement, options: any) => any;
            LatLng: new (lat: number, lng: number) => any;
            MapTypeControlStyle: {
                BUTTON: any;
            };
            Position: {
                TOP_RIGHT: any;
                TOP_LEFT: any;
            };
            ZoomControlStyle: {
                LARGE: any;
            };
        };
    };
}
