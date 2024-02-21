import React from 'react';
import { Breadcrumbs, Typography } from "@mui/material";
import styled from "styled-components";
import Link from '@mui/material/Link';

const TitleAndBreadcrumbs = ({ text, links }) => {
    return (
        <Wrapper>
            <Typography variant="h3" gutterBottom>{ text }</Typography>
            {
                !!links && links.length > 0 &&
                <Breadcrumbs separator=">" color="#ffffff">
                    {
                        links.map(({name, url}, index) => {
                            return (
                                <Link
                                    key={ index }
                                    underline="none"
                                    color="#ffffff"
                                    href={ url }
                                >
                                    { name }
                                </Link>
                            );
                        })
                    }
                </Breadcrumbs>
            }
        </Wrapper>
    );
};

export default TitleAndBreadcrumbs;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 45px 0 40px;
    background-image: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("/breadcrumb.png");
    background-size: cover;
    background-repeat: no-repeat;
    color: #ffffff;
    
    > h3 {
        width: 100%;
        text-align: center;
    }
`;