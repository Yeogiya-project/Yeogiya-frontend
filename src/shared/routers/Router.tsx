import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../home/pages/Home.tsx";
import GameHome from "../../game/pages/GameHome.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/game" element={<GameHome/>}/>
            </Routes>
        </>
    );
}
export default Router