import React, { useState } from 'react';
import styled from "styled-components";
import { grey } from "@mui/material/colors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Collapse, IconButton, Paper, Snackbar, Typography, useMediaQuery } from "@mui/material";
import {
    AddShoppingCart as AddShoppingCartIcon,
    ExpandLess,
    ExpandMore,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useAddBookToBookCart, useFetchBookLike, useToggleBookLike } from "../../../api/queries";
import { queryKeys, queryKeywords } from "../../../api/queryKeys";
import { useQueryClient } from "react-query";

const BookItem = ({ book }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const {
        itemId,
        priceSales: price,
        publisher,
        author,
        pubDate,
        title,
        coverLargeUrl: cover
    } = book;
    const matches = useMediaQuery(theme => theme.breakpoints.down('tablet'));
    const [isOpen, setOpen] = useState(false);
    const handleCollapseToggle = () => {
        setOpen(!isOpen);
    }
    
    /*
     * 북카트
     */
    const [isSuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const { isLoading: isAddBookCartLoading, mutateAsync: mutateAsyncAddBookCart } = useAddBookToBookCart();
    const addBookToBookCart = async () => {
        await mutateAsyncAddBookCart({ itemId: itemId, count: 1 }, {
            onSuccess: isAuthenticated => {
                if (isAuthenticated) {
                    setSuccessSnackbarOpen(true);
                } else {
                    if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
                        redirectLogin();
                    }
                }
            },
            onError: err => {
                console.log(err);
            }
        });
    };
    
    /*
     * 좋아요
     */
    const { isLoading: isFetchBookLikeLoading, data: bookLike } = useFetchBookLike(itemId);
    const { isLoading: isToggleBookLikeLoading, mutateAsync: mutateAsyncToggleBookLike } = useToggleBookLike();
    const handleToggleBookLike = async () => {
        await mutateAsyncToggleBookLike({ itemId: itemId }, {
            onSuccess: data => {
                queryClient.invalidateQueries(queryKeys.bookLike([queryKeywords.principal, { itemId: itemId }]));
            }
        });
    };
    
    function redirectLogin() {
        navigate("/login", { state: { from: location.pathname + location.search } });
    }
    
    return (
        <Wrapper>
            <BookContent>
                <Link to={ `/books/item/${ itemId }` }>
                    <Paper variant="outlined">
                        <Cover>
                            <img src={ cover } alt={ title } />
                        </Cover>
                    </Paper>
                </Link>
                <MetaData>
                    <Link to={ `/books/item/${ itemId }` }>
                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: "bold" }}>{ title }</Typography>
                    </Link>
                    <MetaDataList>
                        { author && <Attribute><span>저자</span>{author}</Attribute> }
                        { publisher && <Attribute><span>출판</span>{ publisher }</Attribute> }
                        { pubDate && <Attribute><span>출간일</span>{ [pubDate.slice(0, 4), ".", pubDate.slice(4, 6), ".", pubDate.slice(6, 8)].join('') }</Attribute> }
                        { price && <Attribute><span>가격</span><Price>{ `${ price.toLocaleString() }원` }</Price></Attribute> }
                    </MetaDataList>
                </MetaData>
                {
                    matches &&
                    <IconButton size="large" sx={{ position: "absolute", bottom: '8px', right: '8px' }} onClick={ handleCollapseToggle }>
                        { isOpen ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>
                }
                {
                    !matches &&
                    <DesktopButtonGroup>
                        <LoadingButton
                            loading={ isFetchBookLikeLoading || isToggleBookLikeLoading }
                            variant="outlined"
                            color="error"
                            startIcon={ bookLike ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                            onClick={ handleToggleBookLike }
                        >
                            좋아요
                        </LoadingButton>
                        <LoadingButton
                            loading={ isAddBookCartLoading }
                            variant="outlined"
                            color="primary"
                            startIcon={ <AddShoppingCartIcon /> }
                            onClick={ addBookToBookCart }
                        >
                            북카트에 담기
                        </LoadingButton>
                        <LoadingButton loading={ false } variant="contained" color="primary">구매하기</LoadingButton>
                    </DesktopButtonGroup>
                }
            </BookContent>
            {
                matches &&
                <Collapse in={ isOpen } sx={{ backgroundColor: "white" }}>
                    <MobileButtonGroup>
                        <LoadingButton
                            loading={ isFetchBookLikeLoading || isToggleBookLikeLoading }
                            variant="outlined"
                            color="error"
                            startIcon={ bookLike ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                            onClick={ handleToggleBookLike }
                        >
                            좋아요
                        </LoadingButton>
                        <LoadingButton
                            loading={ isAddBookCartLoading }
                            variant="outlined"
                            color="primary"
                            startIcon={ <AddShoppingCartIcon /> }
                            onClick={ addBookToBookCart }
                        >
                            북카트에 담기
                        </LoadingButton>
                        <LoadingButton loading={ false } variant="contained" color="primary">구매하기</LoadingButton>
                    </MobileButtonGroup>
                </Collapse>
            }
            <Snackbar
                open={ isSuccessSnackbarOpen }
                onClose={ () => setSuccessSnackbarOpen(false) }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={ 3000 }
                message="북카트에 담겼습니다."
            />
        </Wrapper>
    );
};

export default React.memo(BookItem);

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	padding: 4px 8px;
    
    &:first-child {
        padding-top: 8px;
    }
    &:last-child {
        padding-bottom: 8px;
    }
    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        background-color: ${ grey['100'] };
    }
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        &:not(:last-child) {
            border-bottom: 1px solid ${ grey['500'] };
        }
    }
`;
const BookContent = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    padding: 8px;
    background-color: white;
`;
const Cover = styled.div`
    width: 120px;
    
    > img {
        width: 100%;
        height: 100%;
    }
`;
const MetaData = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 16px;
`;
const MetaDataList = styled.ul``;
const Attribute = styled.li`
    padding: 4px 0;
    
    > span {
        margin-right: 16px;
        color: ${ grey['600'] };
    }
`;
const Price = styled.div`
    display: inline-block;
    font-weight: bold;
    color: red;
`;
const MobileButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
    padding-bottom: 16px;
    
    > button:not(:last-child) {
        margin-right: 8px;
    }
`;
const DesktopButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: auto;
    
    > button:not(:last-child) {
        margin-bottom: 8px;
    }
`;