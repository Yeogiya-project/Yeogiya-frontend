import React, { useEffect, useRef, useState } from 'react';
import type {Restaurant} from "../types/restaurant.ts";

interface MapViewProps {
    recommendedPlace: Restaurant | null;
    onMapClick: (lat: number, lng: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ recommendedPlace, onMapClick }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [clickMarker, setClickMarker] = useState<any>(null);
    const [resultMarker, setResultMarker] = useState<any>(null);

    const markerImageUrl = `data:image/svg+xml;charset=utf-8,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 0C18.745 0 8 10.745 8 24c0 9.427 5.429 17.63 13.25 21.416L32 64l10.75-18.584C50.571 41.63 56 33.427 56 24 56 10.745 45.255 0 32 0z' fill='%23DC143C'/%3E%3Ctext x='32' y='28' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white' text-anchor='middle'%3E%EC%97%AC%EA%B8%B0%EC%9A%94!%3C/text%3E%3C/svg%3E`;

    useEffect(() => {
        if (!window.kakao || !mapContainer.current) return;
        const mapOption = {
            center: new window.kakao.maps.LatLng(37.498, 127.028),
            level: 7,
        };
        const newMap = new window.kakao.maps.Map(mapContainer.current, mapOption);
        setMap(newMap);
    }, []);

    useEffect(() => {
        if (!map) return;
        const listener = (mouseEvent: any) => {
            const latlng = mouseEvent.latLng;
            onMapClick(latlng.getLat(), latlng.getLng());

            if (clickMarker) clickMarker.setMap(null);

            const newMarker = new window.kakao.maps.Marker({ position: latlng });
            newMarker.setMap(map);
            setClickMarker(newMarker);
        };
        window.kakao.maps.event.addListener(map, 'click', listener);
        return () => {
            window.kakao.maps.event.removeListener(map, 'click', listener);
        };
    }, [map, onMapClick, clickMarker]);

    // 추천 결과가 나왔을 때의 로직
    useEffect(() => {
        if (!map) return;

        // X 버튼을 눌러 추천이 사라지면 기존 마커를 지도에서 지움
        if (!recommendedPlace) {
            if (resultMarker) {
                resultMarker.setMap(null);
            }
            return;
        }

        // 새로운 추천 결과가 들어오면 이전 마커 모두 정리
        if (resultMarker) {
            resultMarker.setMap(null);
        }
        if (clickMarker) {
            clickMarker.setMap(null);
        }

        const placePosition = new window.kakao.maps.LatLng(recommendedPlace.latitude, recommendedPlace.longitude);
        const imageSize = new window.kakao.maps.Size(64, 64);
        const imageOption = { offset: new window.kakao.maps.Point(32, 64) };
        const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, imageSize, imageOption);

        const newResultMarker = new window.kakao.maps.Marker({
            position: placePosition,
            image: markerImage
        });
        newResultMarker.setMap(map);
        setResultMarker(newResultMarker);

        // 지도 이동
        map.panTo(placePosition);
        map.setLevel(5, { animate: true });

    }, [map, recommendedPlace]);

    return (
        <div className="w-full max-w-md h-64 mt-8 rounded-2xl shadow-lg overflow-hidden">
            <div id="map" ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};
export default MapView;
