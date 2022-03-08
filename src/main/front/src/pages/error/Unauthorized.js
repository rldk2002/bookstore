import React from 'react';
import styled from "styled-components";
import { Ban } from "@styled-icons/fa-solid";

const Unauthorized = () => {
    return (
        <Wrapper>
            <Ban size="150" />
            <Status>401 Unauthorized</Status>
            <Content>클라이언트가 인증 되지 않았습니다</Content>
        </Wrapper>
    );
};

export default Unauthorized;

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