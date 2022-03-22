import React from 'react';
import styled from "styled-components";
import MainAppBar from "../appbar/MainAppBar";

const MainLayout = ({ children }) => {
    
    return (
        <Wrapper>
            <MainAppBar />
            { children }
        </Wrapper>
    );
};

export default MainLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
    align-items: center;
	width: 100%;
	min-width: 320px;
	min-height: 100vh;
`;