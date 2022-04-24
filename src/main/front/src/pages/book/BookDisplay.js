import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import { useAddBookToBookCart, useFetchBookItem, useFetchBookLike, useToggleBookLike } from "../../api/queries";
import {
    AppBar,
    Box, Button, ButtonGroup,
    CircularProgress,
    Divider, Fab, Link,
    Paper,
    Rating,
    Snackbar, Typography,
    useMediaQuery
} from "@mui/material";
import {
    Remove as RemoveIcon,
    AddShoppingCart as AddShoppingCartIcon,
    Favorite as FavoriteIcon,
    Home,
    FavoriteBorder as FavoriteBorderIcon
} from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import NotFound from "../error/NotFound";
import BookCategoryContext from "../../context/BookCategoryContext";
import { grey } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";
import ItemCounter from "./part/ItemCounter";
import useTitle from "../../services/useTitle";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../api/queryKeys";

const BookDisplay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
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
    
    useTitle(books[0]?.title);
    
    /*
     * 북카트
     */
    const [bookCartCount, setBookCartCount] = useState(1);
    const [isSuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const { isLoading: isAddBookCartLoading, mutateAsync: mutateAsyncAddBookCart } = useAddBookToBookCart();
    const addBookToBookCart = async () => {
        if (bookCartCount > 0) {
            await mutateAsyncAddBookCart({ itemId: itemId, count: bookCartCount }, {
                onSuccess: response => {
                    const { code } = response;
                    if (code === "200") {
                        setSuccessSnackbarOpen(true);
                    }
                    if (code === "401") {
                        redirectLogin();
                    }
                }
            });
        }
    };
    const handleCountChange = count => {
        setBookCartCount(count);
    };
    
    /*
     * 좋아요
     */
    const { isLoading: isFetchBookLikeLoading, data: { content: bookLike } = {} } = useFetchBookLike(itemId);
    const { isLoading: isToggleBookLikeLoading, mutateAsync: mutateAsyncToggleBookLike } = useToggleBookLike();
    const handleToggleBookLike = async () => {
        await mutateAsyncToggleBookLike({ itemId: itemId }, {
            onSuccess: response => {
                const { code } = response;
                if (code === "200") {
                    queryClient.invalidateQueries(queryKeys.bookLike([queryKeywords.principal, { itemId: itemId }]));
                }
                if (code === "401") {
                    redirectLogin();
                }
            }
        });
    };
    
    
    /*
     * Botton Appbar
     */
    const [isBottomAppbarOpen, setBottomAppbarOpen] = useState(false);
    
    if (isFetchBookLoading) {
        return (
            <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // useFetchBookItem()에서 책 정보 조회 실패시 404 Not Found
    if (isFetchBookSuccess && totalResults === 0) {
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
    const categoryName = categoryId === 0 ? "도서>기타" : categoryNameContext[categoryId];
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="2" color="text.primary">{ categoryName.split('>')[0] }</Typography>,
        <Link underline="hover" key="3" color="inherit" href={ `/books/category/${ categoryId }` } sx={{ display: 'flex', alignItems: 'center' }}>{ categoryName.split('>')[1] }</Link>,
        <Typography key="4" color="text.primary">{ title }</Typography>,
    ];
    
    function redirectLogin() {
        navigate("/login", { state: { from: location.pathname + location.search } });
    }
    
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
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ml: "auto" }}>
                                    <ItemCounter onCountChange={ handleCountChange }/>
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
                                </Box>
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
    
            <Snackbar
                open={ isSuccessSnackbarOpen }
                onClose={ () => setSuccessSnackbarOpen(false) }
                anchorOrigin={ matches ? ({ vertical: 'top', horizontal: 'center' }) : ({ vertical: 'bottom', horizontal: 'right' }) }
                autoHideDuration={ 3000 }
                message="북카트에 담겼습니다."
            />
            {
                matches &&
                <AppBar position="fixed" color="transparent" sx={{ top: 'auto', bottom: 0 }}>
                    {
                        isBottomAppbarOpen &&
                        <BottomAppbarOpenBox>
                            <StyledFab onClick={ () => setBottomAppbarOpen(false) }><RemoveIcon /></StyledFab>
                            <ItemCounter onCountChange={ handleCountChange } />
                            <Typography variant="h5" component="div" sx={{ mr: 4 }}>{ (bookCartCount * price).toLocaleString() }원</Typography>
                        </BottomAppbarOpenBox>
                    }
                    {
                        isBottomAppbarOpen ? (
                            <ButtonGroup sx={{ bgcolor: "white" }}>
                                <LoadingButton
                                    loading={ isAddBookCartLoading }
                                    variant="outlined"
                                    size="large"
                                    sx={{ width: 1 }}
                                    onClick={ addBookToBookCart }
                                >
                                    북카트에 담기
                                </LoadingButton>
                                <Button variant="contained" size="large" sx={{ width: 1 }} onClick={ () => setBottomAppbarOpen(true) }>구매하기</Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup sx={{ bgcolor: "white" }}>
                                <Button variant="contained" size="large" sx={{ width: 1 }} onClick={ () => setBottomAppbarOpen(true) }>구매하기</Button>
                                <LoadingButton
                                    color="primary"
                                    size="large"
                                    loading={ isFetchBookLikeLoading || isToggleBookLikeLoading }
                                    onClick={ handleToggleBookLike }
                                >
                                    { bookLike ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon sx={{ color: "red" }} /> }
                                </LoadingButton>
                            </ButtonGroup>
                        )
                    }
                </AppBar>
            }
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
    margin-top: 16px;
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
const BottomAppbarOpenBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px 0;
    background-color: white;
`;
const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});