import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router";
import MainLayout from "../../components/layouts/MainLayout";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import TitleAndBreadcrumbs from "../../components/TitleAndBreadcrumbs";
import styled from "styled-components";
import { Box, CircularProgress, IconButton, Rating, Typography } from "@mui/material";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import QuantityCounter from "../../components/QuantityCounter";
import { LoadingButton } from "@mui/lab";

const BookDetails = () => {
    const { isbn } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    
    const {
        isLoading: isLoadingBookSearch,
        isSuccess: isSuccessBookSearch,
        data: {
            item: book = {}
        } = {}
    } = useQuery(
        [queryKeys.bookSearch([{ isbn: isbn }])],
        () => ajax.get(`/books/search?isbn=${ isbn }`)
    );
    
    /**
     * 도서 찜하기
     */
    const {
        isSuccess: isSuccessFetchBookDibs,
        data: bookDibs
    } = useQuery(
        queryKeys.bookDibs([{ isbn: isbn }, queryKeywords.principal]),
        () => ajax.get(`/books/dibs?isbn=${isbn}`)
    );
    
    const {
        mutateAsync: mutateAsyncBookDibs,
        isLoading: isLoadingBookDibs,
    } = useMutation(({ isbn }) => ajax.post(`/books/dibs?isbn=${isbn}`, null));
    
    const handleClickBookDibs = async () => {
        await mutateAsyncBookDibs({ isbn: isbn }, {
            onSuccess: ({ code, payload }) => {
                if (code === "Success" && payload === true) {
                    toast.info("찜목록에 추가했습니다.");
                    queryClient.invalidateQueries(queryKeys.bookDibs([{ isbn: isbn }, queryKeywords.principal]));
                } else if (code === "Success" && payload === false) {
                    toast.info("찜목록에서 제거했습니다.");
                    queryClient.invalidateQueries(queryKeys.bookDibs([{ isbn: isbn }, queryKeywords.principal]));
                } else if (code === "Full") {
                    toast.warn("찜목록이 가득찼습니다.");
                } else if (code === "Unauthorized") {
                    navigate("/members/login", { state: { from: location.pathname } });
                }
            },
            onError: error => {
            
            }
        })
    }
    
    /**
     * 북카트
     */
    const [bookQuantityCount, setBookQuantityCount] = useState(1);
    const {
        mutateAsync: mutateAsyncAddBookCart,
        isLoading: isLoadingAddBookCart
    } = useMutation(({ isbn, count }) => ajax.post(`/books/cart?isbn=${isbn}&count=${count}`, null));
    
    const handleAddBookCart = async () => {
        await mutateAsyncAddBookCart({ isbn: isbn, count: bookQuantityCount }, {
            onSuccess: data => {
                toast.info("북카트에 추가되었습니다.");
            }
        });
    };
    
    function convertPubdate(str) {
        return str.slice(0, 4) + "년 " + str.slice(4, 6) + "월 " + str.slice(6, 8) + "일";
    }
    
    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "도서" },
        { name: book?.title, url: `/books/details/${isbn}` }
    ];
    
    return (
        <MainLayout title={ book.title }>
            <TitleAndBreadcrumbs text="검색결과" links={ breadcrumbs } />
            <Wrapper>
                <BookContent>
                    {
                        isLoadingBookSearch &&
                        <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                            <CircularProgress />
                        </Box>
                    }
                    {
                        isSuccessBookSearch &&
                        <React.Fragment>
                            <Cover>
                                <img src={ book.image } alt={ book.title } />
                            </Cover>
                            <BookContentInfo>
                                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{ book.title }</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 2 }}>{ book.author } 저자(글)</Typography>
                                <Typography variant="subtitle2">{ book.publisher } · { convertPubdate(book.pubdate) }</Typography>
                                <Typography variant="h4" sx={{ color: "red", my: 2 }}>{ Number(book.discount).toLocaleString('ko-KR') }원</Typography>
                                <Box sx={{ display: "flex", flexFlow: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                                    <Buttons>
                                        <RatingWrapper>
                                            <Rating value={ 4 } readOnly />
                                            <Typography>{ 4 }</Typography>
                                        </RatingWrapper>
                                        <DibsWrapper>
                                            <IconButton
                                                disabled={ isLoadingBookDibs }
                                                onClick={ handleClickBookDibs }
                                            >
                                                { isSuccessFetchBookDibs && bookDibs.code === "Success" && !!bookDibs.payload ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "red" }} /> }
                                            </IconButton>
                                        </DibsWrapper>
                                    </Buttons>
                                    <QuantityCounter count={ bookQuantityCount } getCount={ value => setBookQuantityCount(value) } />
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, mb: 1 }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>총 상품금액: { Number(book.discount * bookQuantityCount).toLocaleString('ko-KR') } 원</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Box>
                                        <LoadingButton
                                            variant="contained"
                                            size="large"
                                            loading={ isLoadingAddBookCart }
                                            onClick={ handleAddBookCart }
                                            sx={{ width: "105px", mr: 1 }}
                                        >북카트</LoadingButton>
                                        <LoadingButton
                                            variant="contained"
                                            size="large"
                                            color="main"
                                        >바로구매</LoadingButton>
                                    </Box>
                                </Box>
                            </BookContentInfo>
                        </React.Fragment>
                    }
                </BookContent>
                
                <Box sx={{ width: 1, border: "1px solid #eaeaea"}} />
                
                <BookDescription>
                    <Typography variant="h5" sx={{ mb: 2 }}>책 소개</Typography>
                    <Typography>{ book.description }</Typography>
                </BookDescription>
                
                <Box sx={{ width: 1, border: "1px solid #eaeaea"}} />
                
                <BookEtc>
                    <Typography variant="h5" sx={{ mb: 2 }}>기타 정보</Typography>
                    <Typography>ISBN : { book.isbn }</Typography>
                </BookEtc>
            </Wrapper>
        </MainLayout>
    );
};

export default BookDetails;

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
const BookContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 30px;
    padding-bottom: 50px;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        flex-direction: row;
        align-items: flex-start;
    }
`;
const Cover = styled.div`
    width: 50%;
    padding: 10px;
    

    > img {
        width: 100%;
    }
    
    &:hover {
        cursor: pointer;
    }
`;
const BookContentInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 50%;
    }
    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        margin-top: 20px;
    }
`;
const Buttons = styled.div`
    display: flex;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    width: fit-content;
    margin-bottom: 10px;
`;
const RatingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-right: 1px solid #eaeaea;
`;
const DibsWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
`;
const BookDescription = styled.div`
    width: 100%;
    padding-top: 30px;
    padding-bottom: 50px;
`;
const BookEtc = styled.div`
    width: 100%;
    padding-top: 30px;
    padding-bottom: 50px;
`;