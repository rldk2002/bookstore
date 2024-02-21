import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Profile from "./pages/member/Profile";
import PrivateRoute from "./components/PrivateRoute";
import BookSearch from "./pages/books/BookSearch";
import BookDibs from "./pages/books/BookDibs";
import BookDetails from "./pages/books/BookDetails";
import BookCart from "./pages/books/BookCart";
import BookOrderSheet from "./pages/books/BookOrderSheet";
// import SignUp from "./pages/authentication/SignUp";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/members/*">
                <Route path="login" element={ <Login /> } />
                {/*<Route path="signup" element={ <SignUp /> } />*/}
                <Route path="profile" element={ <PrivateRoute component={ Profile } /> } />
                <Route path="books/*">
                    <Route path="dibs" element={ <PrivateRoute component={ BookDibs } /> } />
                    <Route path="cart" element={ <PrivateRoute component={ BookCart } /> } />
                </Route>
            </Route>
            <Route path="/books/*">
                <Route path="search" element={ <BookSearch /> } />
                <Route path="details/:isbn" element={ <BookDetails /> } />
                <Route path="order" element={ <PrivateRoute component={ BookOrderSheet } /> } />
            </Route>
        </Routes>
    );
};

export default AppRoutes;