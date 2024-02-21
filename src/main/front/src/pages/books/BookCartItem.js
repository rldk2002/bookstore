import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { Box, Checkbox, CircularProgress, IconButton, Typography } from "@mui/material";
import QuantityCounter from "../../components/QuantityCounter";
import {
    DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import { useRecoilState } from "recoil";
import { bookCartCheckListState } from "../../recoil/atom";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const BookCartItem = ({ isbn, count }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const handleClickLink = () => {
        navigate(`/books/details/${isbn}`);
    };
    
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
    
    const [bookQuantityCount, setBookQuantityCount] = useState(count);
    const [checkedList, setCheckedList] = useRecoilState(bookCartCheckListState);
    const {
        mutateAsync: mutateAsyncChangeBookQuantityCount
    } = useMutation(
        () => ajax.patch(`/books/cart?isbn=${ isbn }&count=${bookQuantityCount}`)
    );
    
    const handleChangeQuantityCount = debounce(async value => {
        setBookQuantityCount(value);
    }, 200);
    
    useEffect( () => {
        async function fetchData() {
            await mutateAsyncChangeBookQuantityCount(null, {
                onSuccess: data => {
                    queryClient.invalidateQueries(queryKeys.bookCart([queryKeywords.principal]));
                }
            });
        }
    
        // if (checkedList.includes(isbn)) {
            fetchData();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookQuantityCount]);
    
    const handleChangeCheck = event => {
        if (event.target.checked === true) {
            setCheckedList([...checkedList, isbn]);
        } else {
            setCheckedList(checkedList.filter(item => item !== isbn));
        }
    };
    
    const {
        mutateAsync: mutateAsyncRemoveBookCartItem
    } = useMutation(
        () => ajax.delete(`/books/cart?isbn=${isbn}`)
    );
    const handleRemoveBookCartItem = async () => {
        await mutateAsyncRemoveBookCartItem(null, {
            onSuccess: data => {
                queryClient.invalidateQueries(queryKeys.bookCart([queryKeywords.principal]));
                setCheckedList(checkedList.filter(item => item !== isbn));
                toast.info("북카트에서 상품을 제거했습니다.");
            },
            onError: error => {
                toast.error("북카트에서 상품을 제거하는데 실패했습니다.");
            }
        })
    };
    
    
    function convertPubdate(str) {
        return str.slice(0, 4) + "년 " + str.slice(4, 6) + "월 " + str.slice(6, 8) + "일";
    }
    
    return (
        <Wrapper>
            <CheckBoxWrapper>
                <Checkbox checked={ checkedList.includes(isbn) } onChange={ handleChangeCheck } />
            </CheckBoxWrapper>
            {
                isLoadingBookSearch &&
                <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                    <CircularProgress />
                </Box>
            }
            {
                isSuccessBookSearch &&
                <BookContent>
                    <BookInfo>
                        <Cover>
                            <img src={ book.image } alt={ book.title } onClick={ () => navigate(`/books/details/${ isbn }`) }/>
                        </Cover>
                        <BookTitle>
                            <Title onClick={ handleClickLink }>{ book.title }</Title>
                            <Author>
                                <Typography variant="body2">{ book.author }</Typography>
                                <Typography variant="body2">{ book.publisher } · { convertPubdate(book.pubdate) }</Typography>
                            </Author>
                        </BookTitle>
                    </BookInfo>
                    <Counter>
                        <Price>
                            { Number(book.discount * bookQuantityCount).toLocaleString('ko-KR') } 원
                        </Price>
                        <QuantityCounter count={ count } getCount={ handleChangeQuantityCount }/>
                        <IconButton onClick={ handleRemoveBookCartItem }><DeleteForeverIcon/></IconButton>
                    </Counter>
                </BookContent>
            }
        </Wrapper>
    );
};

export default BookCartItem;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #eaeaea;
`;
const CheckBoxWrapper = styled.div`

`;
const BookContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        flex-direction: row;
    }
`;
const BookInfo = styled.div`
    display: flex;
    width: 100%;
`;
const Cover = styled.div`
    max-width: 100px;
    padding: 10px;

    > img {
        width: 100%;
        height: -webkit-fill-available;
    }
    
    &:hover {
        cursor: pointer;
    }
`;
const BookTitle = styled.div`
    width: 100%;
    padding: 10px;
`;
const Title = styled.div`
    font-weight: bold;
    
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;
const Counter = styled.div`
    display: flex;
    min-width: 170px;
    justify-content: flex-end;
    align-items: center;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;
const Price = styled(Typography)`
    font-size: 20px;
    font-weight: bold;
`;
const Author = styled.div`
    margin-top: 10px;
`;