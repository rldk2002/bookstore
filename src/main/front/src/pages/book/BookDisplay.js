import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import { useFetchBookItem } from "../../api/queries";
import { Box, CircularProgress, Divider, Link, Paper, Rating, Typography, useMediaQuery } from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon, Favorite as FavoriteIcon, Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import NotFound from "../error/NotFound";
import BookCategoryContext from "../../context/BookCategoryContext";
import { grey } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";

const BookDisplay = () => {
    const matches = useMediaQuery(theme => theme.breakpoints.down('tablet'));
    const categoryNameContext = useContext(BookCategoryContext);
    const { itemId } = useParams();
    const {
        isLoading: isFetchBookLoading,
        isSuccess: isFetchBookSuccess,
        data: {
            item: books = {},
            totalResults
        } = {}
    } = useFetchBookItem(itemId);
    
    if (isFetchBookLoading) {
        return (
            <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (totalResults === 0) {
        return <NotFound />;
    }
    
    const {
        title,
        categoryId,
        coverLargeUrl: cover,
        author,
        publisher,
        pubDate,
        priceSales: price,
        description,
        isbn
    } = books[0];
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="3" color="text.primary">{ categoryNameContext[categoryId]?.split('>')[0] }</Typography>,
        <Typography key="3" color="text.primary">{ categoryNameContext[categoryId]?.split('>')[1] }</Typography>,
        <Typography key="3" color="text.primary">{ title }</Typography>,
    ];
    
    return (
        <MainLayout>
            {
                isFetchBookLoading &&
                <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                    <CircularProgress />
                </Box>
            }
            <Wrapper>
                <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
                <Book>
                    <BoxLeft>
                        <Paper elevation={ 8 }>
                            <Cover>
                                <img src={ cover } alt={ title } />
                            </Cover>
                        </Paper>
                    </BoxLeft>
                    <BoxRight>
                        <Box>
                            <Typography variant="h5" gutterBottom component="div">{ title }</Typography>
                            <Pub>
                                { author && <div>{ author } 저</div> }
                                <div>{ publisher }</div>
                                <div>{ [pubDate.slice(0, 4), ".", pubDate.slice(4, 6), ".", pubDate.slice(6, 8)].join('') }</div>
                            </Pub>
                            <Box sx={{ py: 0.5 }}>
                                <Rating name="half-rating-read" defaultValue={ 2.5 } precision={ 0.5 } readOnly />
                            </Box>
                            <Typography variant="h5" component="div" sx={{ color: "red" }}>{ `${ price.toLocaleString() }원` }</Typography>
                        </Box>
                        {
                            !matches &&
                            <DesktopButtonGroup>
                                <LoadingButton loading={ false } variant="outlined" color="error" startIcon={ <FavoriteIcon /> }>좋아요</LoadingButton>
                                <LoadingButton loading={ false } variant="outlined" color="primary" startIcon={ <AddShoppingCartIcon /> }>북카트에 담기</LoadingButton>
                                <LoadingButton loading={ false } variant="contained" color="primary">구매하기</LoadingButton>
                            </DesktopButtonGroup>
                        }
                    </BoxRight>
                </Book>
                
                <Divider variant="middle" sx={{ width: 1 }} />
                
                <Box sx={{ px: 2, py: 4 }}>
                    <Typography variant="h4" component="div">책 소개</Typography>
                    <Description>{ description }</Description>
                </Box>
                
                <Divider variant="middle" sx={{ width: 1 }} />
    
                <Box sx={{ width: 1, px: 2, py: 4 }}>
                    <Typography variant="h4" component="div">책 정보</Typography>
                    <BookMetaTable>
                        <tbody>
                            <tr>
                                <th>저자</th>
                                <td>{ author }</td>
                            </tr>
                            <tr>
                                <th>출판사</th>
                                <td>{ publisher }</td>
                            </tr>
                            <tr>
                                <th>ISBN</th>
                                <td>{ isbn }</td>
                            </tr>
                            <tr>
                                <th>출간일</th>
                                <td>{ [pubDate.slice(0, 4), ".", pubDate.slice(4, 6), ".", pubDate.slice(6, 8)].join('') }</td>
                            </tr>
                        </tbody>
                    </BookMetaTable>
                </Box>
    
                <Divider variant="middle" sx={{ width: 1 }} />
                
                <Box sx={{ width: 1, px: 2, py: 4 }}>
                    <Typography variant="h4" component="div">평점 및 리뷰</Typography>
                </Box>
            </Wrapper>
        </MainLayout>
    );
};

export default BookDisplay;

const Wrapper = styled.div`
	display: flex;
    flex-direction: column;
	align-items: center;
	width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;
const Book = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    align-items: center;
    padding: 16px;
    
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        flex-direction: row;
        align-items: stretch;
    }
`;
const Cover = styled.div`
    width: 200px;
    
    > img {
        width: 100%;
        height: 100%;
    }
`;
const Pub = styled.div`
    display: flex;
    color: ${ grey['500'] };
    
    > div:not(:last-of-type):after {
        content: "\\00a0|\\00a0";
    }
`;
const BoxLeft = styled.div`
    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        display: flex;
        align-items: center;
        min-height: 300px;
    }
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        margin: auto 32px auto 16px;
    }
`;
const BoxRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin-top: 32px;
    
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        margin-top: 0;
    }
`;
const DesktopButtonGroup = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    
    > button:not(:last-child) {
        margin-right: 8px;
    }
`;
const Description = styled.div`
	width: 100%;
	line-height: 1.5;
	white-space: pre-wrap;
	background-color: #fff;
`;
const BookMetaTable = styled.table`
    width: 100%;
    border: 1px solid ${ grey['300'] };
	
	tr {
		height: 36px;
        border: 1px solid ${ grey['300'] };
	}
	th {
		padding: 0 10px;
		vertical-align: middle;
		background-color: ${ grey['300'] };
	}
	td {
		padding: 0 10px;
        vertical-align: middle;
	}
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
		width: 512px;
    }
`;