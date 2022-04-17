import React from 'react';
import { useAuthentication } from "../api/queries";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...parentProps }) => {
    const location = useLocation();
    const { isLoading, data: principal } = useAuthentication();
    
    if (isLoading) {
        return (
            <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        principal ? <Component { ...parentProps } /> : <Navigate to="/login" state={{ from: location.pathname }} />
    );
};

export default PrivateRoute;