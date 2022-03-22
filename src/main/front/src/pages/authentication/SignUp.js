import React from 'react';
import MainLayout from "../../components/layout/MainLayout";
import { Link, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";

const SignUp = () => {
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="3" color="text.primary">회원가입</Typography>,
    ];
    
    return (
        <MainLayout>
            <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
        </MainLayout>
    );
};

export default SignUp;