import React from 'react';
import styled from "styled-components";
import { useTitle } from "../../hooks/useTitle";
import MainAppbar from "../headers/MainAppbar";

const MainLayout = ({ title, children }) => {
    useTitle(title);

    return (
        <Wrapper>
            <MainAppbar />
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