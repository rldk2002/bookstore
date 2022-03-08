import React from 'react';
import styled from "styled-components";
import { EmotionUnhappy } from "@styled-icons/remix-line";

const BadRequest = () => {
    return (
        <Wrapper>
            <EmotionUnhappy size="150" />
            <Status>400 Bad Request</Status>
            <Content>잘못된 요청입니다</Content>
        </Wrapper>
    );
};

export default BadRequest;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
  	height: 100vh;
`;
const Status = styled.h1`
	margin-bottom: 10px;
	font-size: 32px;
	font-weight: bold;
`;
const Content = styled.h2`
`;