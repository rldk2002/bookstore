import React from 'react';
import MainLayout from "../components/layout/MainLayout";
import { queryKeys } from "../api/queryKeys";


const Home = () => {
    
    console.log(queryKeys.test([{a:1,b:2,c:3}]))
    
    return (
        <MainLayout>
                메인페이지
        </MainLayout>
    );
};

export default Home;

