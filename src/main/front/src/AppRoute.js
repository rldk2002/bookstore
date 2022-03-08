import React from 'react';
import NotFound from "./pages/error/NotFound";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route element={ <NotFound /> } />
        </Routes>
    );
};

export default AppRoute;