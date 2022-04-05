import React from 'react';
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import NotFound from "../error/NotFound";
import MainLayout from "../../components/layout/MainLayout";
import { Box, CircularProgress, Link, Tab, Tabs, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import styled from "styled-components";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import useTitle from "../../services/useTitle";
import { useFetchBookSection } from "../../api/queries";
import queryString from "query-string";
import BookItem from "./part/BookItem";

const BookCategoryResult = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const params = queryString.parse(location.search);
    const { section = 'bestSeller' } = params;
    
    const {
        isLoading: isFetchBookLoading,
        isSuccess: isFetchBookSuccess,
        data: { item: books, searchCategoryName, title } = {}
    } = useFetchBookSection(categoryId, section);
    
    useTitle(`${ searchCategoryName } - ${ title }`);
    
    if ((categoryId >= 101 && categoryId <= 129) || (categoryId >= 201 && categoryId <= 217)) {
        const handleTabChange = (event, newValue) => {
            navigate({
                pathname: `/books/category/${ categoryId }`,
                search: `${ createSearchParams({ section: newValue }) }`
            });
        };
        
        const breadcrumbs = [
            <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
            <Typography key="3" color="text.primary">{ searchCategoryName?.replace('>', '/') }</Typography>,
            <Typography key="3" color="text.primary">{ title }</Typography>,
        ];
        
        return (
            <MainLayout>
                <Wrapper>
                    <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
                    <Box sx={{ width: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={ section } onChange={ handleTabChange } >
                            <Tab value="bestSeller" label="베스트셀러" />
                            <Tab value="recommend" label="추천도서" />
                            <Tab value="newBook" label="신규도서" />
                        </Tabs>
                    </Box>
                    {
                        isFetchBookSuccess && books.map(book => {
                            return (
                                <BookItem key={ book.itemId } book={ book } />
                            );
                        })
                    }
                    {
                        isFetchBookLoading &&
                        <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                            <CircularProgress />
                        </Box>
                    }
                </Wrapper>
            </MainLayout>
        );
    } else {
        return <NotFound />;
    }
    
};

export default BookCategoryResult;

const Wrapper = styled.div`
	display: flex;
    flex-direction: column;
	align-items: center;
	width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;