import React, { useContext } from 'react';
import { Box, CircularProgress, FormControl, InputLabel, Link, MenuItem, Select, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import BookCategoryContext from "../../context/BookCategoryContext";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import produce from "immer";
import { useFetchBookSection } from "../../api/queries";
import BookItem from "./part/BookItem";
import useTitle from "../../services/useTitle";

const BestSeller = () => {
    const categoryNameContext = useContext(BookCategoryContext);
    const navigate = useNavigate();
    const location = useLocation();
    const params = queryString.parse(location.search);
    const { categoryId = '100' } = params;
    
    const {
        isLoading: isFetchBookLoading,
        isSuccess: isFetchBookSuccess,
        data: {
            item: books,
            searchCategoryName,
            totalResults,
            title
        } = {}
    } = useFetchBookSection(categoryId, location.pathname.split("/")[2]);
    
    useTitle(`${ title } - ${ searchCategoryName }`);
    
    const handleSearchTargetChange = event => {
        const searchTarget = event.target.value;
        redirectPage(
            produce(params, draft => {
                draft['searchTarget'] = searchTarget;
                switch (searchTarget) {
                    case 'foreign': draft['categoryId'] = 200; break;
                    default: draft['categoryId'] = 100;
                }
            })
        );
    };
    const handleCategoryIdChange = event => {
        const categoryId = event.target.value;
        redirectPage(
            produce(params, draft => {
                draft['categoryId'] = categoryId;
            })
        );
    };
    
    function redirectPage(params) {
        navigate({
            pathname: '/books/bestSeller',
            search: `${ createSearchParams(params) }`
        });
    }
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="2" color="text.primary">{ title }</Typography>,
    ];
    
    return (
        <MainLayout>
            <Wrapper>
                <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
                <BookFilters>
                    <FormControl sx={{ mr: 1 }}>
                        <InputLabel id="searchTarget">??????</InputLabel>
                        <Select
                            labelId="searchTarget"
                            label="??????"
                            size="small"
                            value={ params.searchTarget || 'book' }
                            onChange={ handleSearchTargetChange }
                        >
                            <MenuItem value="book">????????????</MenuItem>
                            <MenuItem value="foreign">????????????</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="categoryId">????????????</InputLabel>
                        <Select
                            labelId="categoryId"
                            label="????????????"
                            size="small"
                            value={ params.categoryId || 100 }
                            onChange={ handleCategoryIdChange }
                        >
                            { ((params.searchTarget || 'book') === 'book') && <MenuItem value={ 100 } >??????</MenuItem> }
                            {
                                ((params.searchTarget || 'book') === 'book') &&
                                Object.entries(categoryNameContext)
                                    .filter(([key, value]) => value.startsWith("????????????>"))
                                    .map(([key, value]) => [key, value.substring("????????????>".length)])
                                    .map(([key, value]) => {
                                        return (
                                            <MenuItem key={ key } value={ key }>{ value }</MenuItem>
                                        );
                                    })
                            }
                            { (params.searchTarget === 'foreign') && <MenuItem value={ 200 } >??????</MenuItem> }
                            {
                                (params.searchTarget === 'foreign') &&
                                Object.entries(categoryNameContext)
                                    .filter(([key, value]) => value.startsWith("????????????>"))
                                    .map(([key, value]) => [key, value.substring("????????????>".length)])
                                    .map(([key, value]) => {
                                        return (
                                            <MenuItem key={ key } value={ key }>{ value }</MenuItem>
                                        );
                                    })
                            }
                        </Select>
                    </FormControl>
                </BookFilters>
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
                {
                    isFetchBookSuccess && totalResults === 0 &&
                    <Box sx={{ display: "flex", justifyContent: "center", px: 1, py: 10 }}>
                        <Typography variant="h4" component="div">??????????????? ????????????.</Typography>
                    </Box>
                }
            </Wrapper>
        </MainLayout>
    );
};

export default BestSeller;

const Wrapper = styled.div`
	display: flex;
    flex-direction: column;
	align-items: center;
	width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;
const BookFilters = styled.div`
    display: flex;
    width: 100%;
    padding: 16px 8px;
    border-bottom: 1px solid;
`;