import React from 'react';
import styled from "styled-components";
import { PlugDisconnected } from "@styled-icons/fluentui-system-regular";

const InternalServerError = () => {
    return (
        <Wrapper>
            <PlugDisconnected size="150" />
            <Status>500 Internal Server Error</Status>
            <Content>내부 서버 오류</Content>
        </Wrapper>
    );
};

export default InternalServerError;

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