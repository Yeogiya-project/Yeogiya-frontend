import {Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../../home/pages/Home.tsx";

const Router: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}
export default Router