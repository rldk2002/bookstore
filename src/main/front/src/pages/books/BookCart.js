import React, { useEffect, useState } from 'react';
import MainLayout from "../../components/layouts/MainLayout";
import TitleAndBreadcrumbs from "../../components/TitleAndBreadcrumbs";
import { useQuery } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import styled from "styled-components";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import BookCartItem from "./BookCartItem";
import { useRecoilState } from "recoil";
import { bookCartCheckListState } from "../../recoil/atom";

const BookCart = () => {
    
    const {
        isLoading: isLoadingFetchBookCart,
        isSuccess: isSuceessFetchBookCart,
        data: bookCart
    } = useQuery(
        queryKeys.bookCart([queryKeywords.principal]),
        () => ajax.get("/books/cart")
    );
    
    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "마이페이지", url: "/members/mypage" },
        { name: "내 북카트", url: "/members/books/cart" }
    ];
    
    const [isAllChecked, setAllChecked] = useState(false);
    const [bookCartCheckList, setBookCartCheckList] = useRecoilState(bookCartCheckListState);
    
    const handleChangeAllChecked = event => {
        if (event.target.checked === true) {
            setBookCartCheckList(bookCart.map(item => item.isbn));
        } else {
            setBookCartCheckList([]);
        }
    };
    
    useEffect(() => {
        if (isSuceessFetchBookCart) {
            bookCartCheckList.length === bookCart.length ? setAllChecked(true) : setAllChecked(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookCartCheckList]);
    
    
    return (
        <MainLayout title="내 찜목록">
            <TitleAndBreadcrumbs text="내 북카트" links={ breadcrumbs } />
            <Wrapper>
                <Total>
                    <FormControlLabel control={<Checkbox checked={ isAllChecked } onChange={ handleChangeAllChecked } sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />} label="전체" />
                </Total>
                <CartList>
                    {
                        isLoadingFetchBookCart &&
                        <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                            <CircularProgress />
                        </Box>
                    }
                    {
                        isSuceessFetchBookCart &&
                        bookCart.map(item => {
                            return <BookCartItem key={ item.isbn } isbn={ item.isbn } count={ item.count } />;
                        })
                    }
                </CartList>
                <Box sx={{ width: 1, py: "60px" }}>
                    <Button variant="contained" size="large" fullWidth>주문하기</Button>
                </Box>
            </Wrapper>
        </MainLayout>
    );
};

export default BookCart;

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
`;
const Total = styled.div`
    width: 100%;
    margin-top: 30px;
    border-top: 2px solid;
    border-bottom: 2px solid;
`;
const CartList = styled.div`
    width: 100%;
    margin-bottom: 50px;
`;