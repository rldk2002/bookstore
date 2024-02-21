import React from 'react';
import { useNavigate } from "react-router";
import { useQuery } from "react-query";
import { queryKeys } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { Pagination } from "@mui/material";
import styled from "styled-components";
import MainLayout from "../../components/layouts/MainLayout";
import TitleAndBreadcrumbs from "../../components/TitleAndBreadcrumbs";
import BookSearchItem from "./BookSearchItem";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


const BookSearch = () => {
    const navigate = useNavigate();
    
    const [searchParams, setSearchParams] = useSearchParams(); //eslint-disable-line no-unused-vars
    const query = searchParams.get("query");
    const start = searchParams.get("start") ?? 1;
    const sort = searchParams.get("sort") ?? "sim";
    
    const {
        isLoading: isLoadingBookSearch,
        isSuccess: isSuccessBookSearch,
        data: {
            total,
            items
        } = {}
    } = useQuery(
        queryKeys.bookSearch([{ query: query, start: start, sort: sort }]),
        () => ajax.get(`/books/search?query=${query}&start=${start}&sort=${sort}`), {
            onError: err => {
                const errCode = err.data;
                switch (errCode) {
                    case "NB01":
                        toast.error("네이버 도서 API에서 도서정보를 불러오는데 실패했습니다.");
                        break;
                    default:
                }
            }
        }
    );
    
    const handleChangeSort = (event) => {
        navigate(`/books/search?query=${query}&start=1&sort=${event.target.value}`);
    };
    const handleChangePage = (event, value) => {
        navigate(`/books/search?query=${query}&start=${value}&sort=${sort}`);
    };
    
    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "검색" },
        { name: query, url: `/books/search?query=${query}` }
    ];
    
    return (
        <MainLayout title="검색결과">
            <TitleAndBreadcrumbs text="검색결과" links={ breadcrumbs } />
            <Wrapper>
                {
                    isLoadingBookSearch &&
                    <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                        <CircularProgress />
                    </Box>
                }
                {
                    isSuccessBookSearch &&
                    <React.Fragment>
                        <Box sx={{ justifyContent: "flex-start", width: 1, p: "40px 0" }}>
                            <Typography variant="h5">
                                <span style={{ color: "#7fad39" }}>'{ query }'</span>
                                에 대한 {total}개의 검색결과
                            </Typography>
                        </Box>
                        <Sort>
                            <FormControl sx={{ width: 120 }} size="small">
                                <InputLabel id="sort">정렬</InputLabel>
                                <Select
                                    labelId="sort"
                                    id="demo-simple-select"
                                    value={ sort }
                                    label="정렬"
                                    onChange={ handleChangeSort }
                                >
                                    <MenuItem value="sim">정확도순</MenuItem>
                                    <MenuItem value="date">출간일순</MenuItem>
                                </Select>
                            </FormControl>
                        </Sort>
                        <Box>
                        {
                            items.map(item => <BookSearchItem key={ item.isbn } item={ item }/>)
                        }
                        </Box>
                        <Stack spacing={2} sx={{ my: "50px" }}>
                            <Pagination count={10} onChange={ handleChangePage } />
                        </Stack>
                    </React.Fragment>
                }
            </Wrapper>
        </MainLayout>
    );
};

export default BookSearch;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 768px;
    }
    ${ ({ theme }) => theme.breakpoints.up('desktop') } {
        width: 1024px;
    }
`;
const Sort = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
`;