import React, { useState } from 'react';
import styled from "styled-components";

const MainLayout = ({ children }) => {
    const [isOpened, setOpened] = useState(false);
    
    return (
        <Wrapper>
            {
                !isOpened &&
                <>
                    { children }
                </>
            }
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