import React, {useEffect, useState} from "react";

const Home: React.FC = () => {

    useEffect(() => {
        if (window.naver && window.naver.maps) {
            new window.naver.maps.Map('map', {
                zoom: 16,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: window.naver.maps.MapTypeControlStyle.BUTTON,
                    position: window.naver.maps.Position.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: window.naver.maps.ZoomControlStyle.LARGE,
                    position: window.naver.maps.Position.TOP_LEFT
                }
            });
        } else {
            console.error("네이버 지도 API가 로드되지 않았습니다.");
        }
    }, []);

    return (
        <div className="w-full h-full">
            <div
                id="map"
                className="w-full h-full"
            />
        </div>
    );
}

export default Home;