import React from 'react';
import NotFound from "./pages/error/NotFound";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import BookSearchResult from "./pages/book/BookSearchResult";
import BookCategoryResult from "./pages/book/BookCategoryResult";

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <SignUp /> } />
            <Route path="/books/*">
                <Route path="search" element={ <BookSearchResult /> } />
                <Route path="category/:categoryId" element={ <BookCategoryResult /> } />
            </Route>
            <Route path="*" element={ <NotFound /> } />
        </Routes>
    );
};

export default AppRoute;