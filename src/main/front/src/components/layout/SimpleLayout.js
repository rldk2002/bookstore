import React from 'react';
import styled from "styled-components";
import TitleAppBar from "../appbar/TitleAppBar";

const SimpleLayout = ({ title, children }) => {
    return (
        <Wrapper>
            <TitleAppBar title={ title }/>
            { children }
        </Wrapper>
    );
};

export default SimpleLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
    align-items: center;
	width: 100%;
	min-width: 320px;
	min-height: 100vh;
`;