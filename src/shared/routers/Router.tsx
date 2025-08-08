import {Route, Routes} from "react-router-dom";
import React from "react";
import KakaoHome from "../../home/pages/kakao/KakaoHome.tsx";
// import NaverHome from "../../pages/home/NaverHome.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                {/*<Route path="/" element={<NaverHome/>}/>*/}
                <Route path="/" element={<KakaoHome/>}/>
            </Routes>
        </>
    );
}
export default Router