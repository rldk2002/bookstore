import React from 'react';
import { useNavigate } from "react-router";
import MainLayout from "../../components/layouts/MainLayout";

const Profile = () => {
    const navigate = useNavigate();
    
    return (
        <MainLayout title="마이페이지">
            프로파일 페이지
            
            <button onClick={ () => navigate("/") }>ddd</button>
        </MainLayout>
    );
};

export default Profile;