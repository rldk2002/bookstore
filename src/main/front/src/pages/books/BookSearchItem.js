import React from 'react';
import { Button, IconButton, Typography, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    AddShoppingCart as AddShoppingCartIcon,
    Paid as PaidIcon
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";

const BookSearchItem = ({ item: book }) => {
    const {
        title,
        author,
        publisher,
        description,
        image,
        isbn,
        pubdate,
        discount
    } = book;
    
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobileScreen = useMediaQuery("(max-width: 768px)");
    
    const handleClickLink = () => {
        navigate(`/books/details/${isbn}`);
    };
    
    function convertPubdate(str) {
        return str.slice(0, 4) + "년 " + str.slice(4, 6) + "월 " + str.slice(6, 8) + "일";
    }
    
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
                    queryClient.invalidateQueries(queryKeys.bookDibs([{ isbn: isbn }, queryKeywords.principal]));
                    toast.info("찜목록에 추가했습니다.");
                } else if (code === "Success" && payload === false) {
                    queryClient.invalidateQueries(queryKeys.bookDibs([{ isbn: isbn }, queryKeywords.principal]));
                    toast.info("찜목록에서 제거했습니다.");
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
    const {
        mutateAsync: mutateAsyncAddBookCart,
        isLoading: isLoadingAddBookCart
    } = useMutation(({ isbn, count }) => ajax.post(`/books/cart?isbn=${isbn}&count=${count}`, null));
    
    const handleAddBookCart = async () => {
        await mutateAsyncAddBookCart({ isbn: isbn, count: 1 }, {
            onSuccess: data => {
                toast.info("북카트에 추가되었습니다.");
            }
        });
    };
    
    return (
        <Wrapper>
            <Top>
                <BookCoverSection>
                    <Link to={ `/books/details/${isbn}` }>
                        <Cover>
                            <img alt={ title } src={ image } onClick={ handleClickLink } />
                        </Cover>
                    </Link>
                </BookCoverSection>
                <BookDetailsSection>
                    <Title onClick={ handleClickLink }>{ title }</Title>
                    <Author>
                        <Typography variant="body2">{ author }</Typography>
                        <Typography variant="body2">{ publisher } · { convertPubdate(pubdate) }</Typography>
                    </Author>
                    <Price>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>{ Number(discount).toLocaleString('ko-KR') }원</Typography>
                    </Price>
                    <Description>{ description }</Description>
                </BookDetailsSection>
                {
                    !isMobileScreen &&
                    <ButtonSection>
                        <IconButton
                            disabled={ isLoadingBookDibs }
                            onClick={ handleClickBookDibs }
                        >
                            { isSuccessFetchBookDibs && bookDibs.code === "Success" && !!bookDibs.payload ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "red" }} /> }
                        </IconButton>
                        <LoadingButton
                            variant="contained"
                            loading={ isLoadingAddBookCart }
                            onClick={ handleAddBookCart }
                            sx={{ width: "90px" }}
                        >북카트</LoadingButton>
                        <Button variant="contained" sx={{ width: "90px" }} color="main">바로구매</Button>
                    </ButtonSection>
                }
            </Top>
            {
                isMobileScreen &&
                <Bottom>
                    <IconButton
                        disabled={ isLoadingBookDibs }
                        onClick={ handleClickBookDibs }
                    >
                        { isSuccessFetchBookDibs && bookDibs.code === "Success" && !!bookDibs.payload ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "red" }} /> }
                    </IconButton>
                    <IconButton
                        onClick={ handleAddBookCart }
                    >
                        <AddShoppingCartIcon />
                    </IconButton>
                    <IconButton><PaidIcon /></IconButton>
                </Bottom>
            }
        </Wrapper>
    );
};

export default BookSearchItem;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #eaeaea;
    box-sizing: border-box;
`;
const Top = styled.div`
    display: flex;
    width: 100%;
`;
const Bottom = styled.div`
    display: flex;
    justify-content: flex-end;
`;
const BookCoverSection = styled.div`
    width: 140px;
`;
const BookDetailsSection = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: calc(100% - 140px - 120px);

    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        width: calc(100% - 140px);
    }
`;
const ButtonSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 120px;
    
    > button {
        margin-top: 10px;
    }
`;
const Cover = styled.div`
    width: 140px;
    height: 200px;
    border: 1px dotted #eaeaea;
    
    > img {
        width: 100%;
        height: -webkit-fill-available;
        
        &:hover {
            cursor: pointer;
        }
    }
`;
const Title = styled.div`
    font-weight: bold;
    
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;
const Author = styled.div`
    margin-top: 10px;
`;
const Price = styled.div`
    display: flex;
    margin-top: 12px;
`;
const Description = styled.div`
    max-height: 40px;
    margin-top: 20px;
    line-height: 1.6;
    font-size: 12px;
    overflow: hidden;
`;
