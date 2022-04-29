import React from 'react';
import NotFound from "./pages/error/NotFound";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import BookSearchResult from "./pages/book/BookSearchResult";
import BookCategoryResult from "./pages/book/BookCategoryResult";
import BookDisplay from "./pages/book/BookDisplay";
import BookCart from "./pages/book/BookCart";
import PrivateRoute from "./pages/PrivateRoute";
import BestSeller from "./pages/book/BestSeller";

const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <SignUp /> } />
            <Route path="/books/*">
                <Route path="search" element={ <BookSearchResult /> } />
                {
                    ["bestSeller", "newBook", "recommend"].map((path, index) => {
                        return <Route path={ path } element={ <BestSeller /> } key={ index } />;
                    })
                }
                <Route path="category/:categoryId" element={ <BookCategoryResult /> } />
                <Route path="item/:itemId" element={ <BookDisplay /> } />
                <Route path="cart" element={ <PrivateRoute component={ BookCart } /> }/>
                <Route path="*" element={ <NotFound /> } />
            </Route>
            <Route path="*" element={ <NotFound /> } />
        </Routes>
    );
};

export default AppRoute;