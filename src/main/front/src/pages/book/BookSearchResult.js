import React, { useContext } from 'react';
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Pagination,
    Select,
    Typography
} from "@mui/material";
import { Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import { useFetchBookQuery } from "../../api/queries";
import styled from "styled-components";
import BookItem from "./part/BookItem";
import produce from "immer";
import queryString from "query-string";
import BookCategoryContext from "../../context/BookCategoryContext";

const BookSearchResult = () => {
    const categoryNameContext = useContext(BookCategoryContext);
    const navigate = useNavigate();
    const location = useLocation();
    const params = queryString.parse(location.search);
    
    const {
        isLoading: isFetchBookLoading,
        isSuccess: isFetchBookSuccess,
        data: {
            item: books,
            totalResults,
            maxResults
        } = {}
    } = useFetchBookQuery(params);
    
    const handleSearchTargetChange = event => {
        const searchTarget = event.target.value;
        redirectSearchResultPage(
            produce(params, draft => {
                draft['searchTarget'] = searchTarget;
                switch (searchTarget) {
                    case 'foreign': draft['categoryId'] = 200; break;
                    default: draft['categoryId'] = 100;
                }
                draft['page'] = 1;
            })
        );
    };
    const handleCategoryIdChange = event => {
        const categoryId = event.target.value;
        redirectSearchResultPage(
            produce(params, draft => {
                draft['categoryId'] = categoryId;
                draft['page'] = 1;
            })
        );
    };
    const handleSortChange = event => {
        const sort = event.target.value;
        redirectSearchResultPage(
            produce(params, draft => {
                draft['sort'] = sort;
                draft['page'] = 1;
            })
        );
    };
    const handlePaginationNumber = (event, page) => {
        redirectSearchResultPage(
            produce(params, draft => {
                draft['page'] = page;
            })
        );
    }
    
    function redirectSearchResultPage(params) {
        navigate({
            pathname: '/books/search',
            search: `${ createSearchParams(params) }`
        });
    }
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="2" color="text.primary">?????? ????????????</Typography>,
    ];
    
    return (
        <MainLayout>
            <Wrapper>
                <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
                <PageTitle><span>'{ params.query }'</span> ?????? ??????</PageTitle>
                <BookFilters>
                    <Box>
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
                    </Box>
                    <Box>
                        <FormControl>
                            <InputLabel id="sort">??????</InputLabel>
                            <Select
                                labelId="sort"
                                label="??????"
                                size="small"
                                value={ params.sort || 'accuracy' }
                                onChange={ handleSortChange }
                            >
                                <MenuItem value="accuracy">????????????</MenuItem>
                                <MenuItem value="publishTime">????????????</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </BookFilters>
                <SearchResults>
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
                        isFetchBookSuccess && totalResults > 0 &&
                        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                            <Pagination
                                count={ Math.floor(totalResults / maxResults) + 1 }
                                color="primary"
                                page={ Number(params.page || 1) }
                                onChange={ handlePaginationNumber }
                            />
                        </Box>
                    }
                    {
                        isFetchBookSuccess && totalResults === 0 &&
                        <Box sx={{ display: "flex", justifyContent: "center", px: 1, py: 10 }}>
                            <Typography variant="h4" component="div">??????????????? ????????????.</Typography>
                        </Box>
                    }
                </SearchResults>
            </Wrapper>
        </MainLayout>
    );
};

export default BookSearchResult;

const Wrapper = styled.div`
	display: flex;
    flex-direction: column;
	align-items: center;
	width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;
const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
`;
const PageTitle = styled.div`
    margin-right: auto;
    padding: 16px;
    font-size: 24px;
    
    > span {
        font-weight: bold;
        color: orange;
    }
`;
const BookFilters = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 16px 8px;
    border-bottom: 1px solid;
`;
