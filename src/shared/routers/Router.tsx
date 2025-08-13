import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../home/pages/Home.tsx";
import RestaurantPage from "../../restaurant/pages/RestaurantPage.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/recommend" element={<RestaurantPage/>}/>
            </Routes>
        </>
    );
}
export default Router