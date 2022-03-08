import React from "react";
import styled from "styled-components";

const EmptyLayout = ({ children }) => {
    return (
        <Wrapper>{ children }</Wrapper>
    );
};

export default EmptyLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
    align-items: center;
	width: 100%;
	min-width: 320px;
	min-height: 100vh;
`;