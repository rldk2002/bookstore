import React from 'react';
import styled from "styled-components";
import { Ban } from "@styled-icons/fa-solid";

const Forbidden = () => {
    return (
        <Wrapper>
            <Ban size="150" />
            <Status>403 Forbidden</Status>
            <Content>권한이 없어 요청이 거부되었습니다</Content>
        </Wrapper>
    );
};

export default Forbidden;

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