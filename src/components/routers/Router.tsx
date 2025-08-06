import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../pages/Home";
import RestaurantPage from "../../pages/RestaurantPage";


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