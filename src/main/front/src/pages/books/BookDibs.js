import React from 'react';
import MainLayout from "../../components/layouts/MainLayout";
import TitleAndBreadcrumbs from "../../components/TitleAndBreadcrumbs";
import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import styled from "styled-components";
import BookDibsItem from "./BookDibsItem";

const BookDibs = () => {
    
    const {
        isLoading: isLoadingBookDibsList,
        isSuccess: isSuccessBookDibsList,
        data: dibsList
    } = useQuery(
        [queryKeys.bookDibs([queryKeywords.principal])],
        () => ajax.get("/books/dibs/list")
    );
    
    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "마이페이지", url: "/members/mypage" },
        { name: "내 찜목록", url: "/members/books/dibs" }
    ];
    
    return (
        <MainLayout title="내 찜목록">
            <TitleAndBreadcrumbs text="내 찜목록" links={ breadcrumbs } />
            <Wrapper>
                {
                    isLoadingBookDibsList &&
                    <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                        <CircularProgress />
                    </Box>
                }
                {
                    isSuccessBookDibsList &&
                    <BookDibsList>
                    {
                        dibsList.map(dibs => {
                            return (
                                <BookDibsItem key={ dibs.isbn } isbn={ dibs.isbn } />
                            );
                        })
                    }
                    </BookDibsList>
                }
            </Wrapper>
        </MainLayout>
    );
};

export default BookDibs;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 32px 16px;
    box-sizing: border-box;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 768px;
    }
    ${ ({ theme }) => theme.breakpoints.up('desktop') } {
        width: 1024px;
    }
`;
const BookDibsList = styled.div`
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    width: 100%;
`;