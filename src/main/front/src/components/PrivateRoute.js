import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { queryKeywords } from "../ajax/queryKeys";
import { useQuery } from "react-query";
import { default as ajax } from "../ajax/axiosInterceptor";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = ({ component: Component, ...parentProps }) => {
    const location = useLocation();
    
    const {
        isLoading,
        isSuccess,
        data: isAuthentication
    } = useQuery(
        [queryKeywords.principal],
        () => ajax.get("/members/authentication")
    );
    
    if (isLoading) {
        return (
            <Box sx={{ width: 1, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else {
        return (
            isSuccess && isAuthentication ? <Component { ...parentProps } /> : <Navigate to="/members/login" state={{ from: location.pathname }} />
        );
        
    }
    
};

export default PrivateRoute;