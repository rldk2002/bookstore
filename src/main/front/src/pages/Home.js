import React from 'react';
import MainLayout from "../components/layout/MainLayout";
import { queryKeys } from "../api/queryKeys";
import { useFetchBookItem } from "../api/queries";


const Home = () => {
    let a = {a: 1, b:2};
    console.log({c:3, ...a});
    
    return (
        <MainLayout>
                메인페이지
        </MainLayout>
    );
};

export default Home;

