import React, { useEffect, useState } from 'react';
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import useTitle from "../../services/useTitle";
import {
    Box,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Link,
    Paper,
    Snackbar,
    Typography
} from "@mui/material";
import { useFetchBookCart, useFetchBookItem, useUpdateBookCartCount } from "../../api/queries";
import { Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import { Link as RRDLink, useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import ItemCounter from "./part/ItemCounter";
import { LoadingButton } from "@mui/lab";
import { useQueries, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../api/queryKeys";
import ajax from "../../api/axiosInterceptor";

const BookCartItem = ({ bookCart }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { itemId, count } = bookCart;
    const [bookCartCount, setBookCartCount] = useState(count);
    const [isSuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    
    const { isLoading, isSuccess, data: { item: book } = {} } = useFetchBookItem(itemId);
    const { isLoading: isUpdateBookCartCountLoading,  mutateAsync: mutateAsyncUpdateBookCartCount } = useUpdateBookCartCount();
    
    const handleUpdateBookCartCount = async () => {
        await mutateAsyncUpdateBookCartCount({ itemId: itemId, count: bookCartCount }, {
            onSuccess: isAuthenticated => {
                if (isAuthenticated) {
                    queryClient.invalidateQueries(queryKeys.bookCart([queryKeywords.principal]));
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
        })
    };
    
    if (isLoading) {
        return (
            <Box sx={{ width: 1, my: 5, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (isSuccess) {
        const {
            title,
            priceSales: price,
            coverLargeUrl: cover
        } = book[0];
        
        return (
            <Box sx={{ width: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", padding: "8px 8px 8px 0" }}>
                    <Box sx={{ display: "flex", width: 1 }}>
                        <Box sx={{ display: "flex", width: 1 }}>
                            <RRDLink to={ `/books/item/${ itemId }` }>
                                <Paper variant="outlined">
                                    <Cover>
                                        <img src={ cover } alt={ title } />
                                    </Cover>
                                </Paper>
                            </RRDLink>
                            <Amount>
                                <Typography variant="subtitle1" component="div" sx={{ fontWeight: "bold" }}>{ title }</Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <ItemCounter initCount={ count } onCountChange={ count => setBookCartCount(count) } />
                                    <Box sx={{ mt: 1 }}>
                                        <LoadingButton
                                            loading={ isUpdateBookCartCountLoading }
                                            variant="contained"
                                            size="small"
                                            onClick={ handleUpdateBookCartCount }
                                        >
                                            수량변경
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            </Amount>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Price>
                        <li>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: "bold" }}>주문금액</Typography>
                            <Typography variant="subtitle1" component="div" sx={{ color: "red" }}>{ (price * bookCartCount).toLocaleString() }원</Typography>
                        </li>
                    </Price>
                </Box>
                <Snackbar
                    open={ isSuccessSnackbarOpen }
                    onClose={ () => setSuccessSnackbarOpen(false) }
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={ 3000 }
                    message="수량이 변경되었습니다."
                />
            </Box>
        );
    }
    
    function redirectLogin() {
        navigate("/login", { state: { from: location.pathname + location.search } });
    }
};

const TotalPrice = ({ checkedList, bookCartList }) => {
    const bookQueries = useQueries(
        checkedList.map(itemId => {
            return {
                queryKey: queryKeys.book([{ itemId: itemId }]),
                queryFn: () => ajax.get("/books/item/" + itemId)
            };
        })
    );
    const allFinishd = bookQueries.every(query => query.isSuccess);
    const [totalPrice, setTotalPrice] = useState(0);
    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        if (allFinishd) {
            const items = [];
            const total = bookQueries.reduce((sum, query) => {
                const { data: { item }} = query;
                const { itemId, priceSales: price, title } = item[0];
                const idx = bookCartList.findIndex(element => element.itemId === itemId);
                const count = bookCartList[idx].count;
                items.push({ itemId: itemId, title: title, price: price, count: count });
                return sum + price * count;
            }, 0);
            setTotalPrice(total);
            setBooks(items);
        }
        // eslint-disable-next-line
    },[allFinishd, checkedList]);
    
    return (
        <TotalPriceWrapper>
            <Box sx={{ ml: "auto" }}>
                {
                    books.map(({ itemId, title, price, count }) => {
                        return (
                            <Box key={ itemId } sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box sx={{ mr: 2 }}>{`- ${ title } (${ count })`}</Box>
                                <div>{ (price * count).toLocaleString() }원</div>
                            </Box>
                        );
                    })
                }
            </Box>
            <Divider sx={{ my: 1 }}/>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>결제 예정 금액</Typography>
                <Typography variant="h6" component="div" sx={{ color: "red" }}>{ totalPrice.toLocaleString() }원</Typography>
            </Box>
        </TotalPriceWrapper>
    );
};

const BookCart = () => {
    const {
        isLoading: isFetchBookCartLoading,
        isSuccess: isFetchBookCartSuccess,
        data: bookCarts
    } = useFetchBookCart();
    const [isAllChecked, setAllChecked] = useState(true);
    const [checkedBookCartList, setCheckedBookCartList] = useState([]);
    
    useTitle("북카트");
    
    useEffect(() => {
        setCheckedBookCartList(bookCarts?.map(book => book.itemId));
        setAllChecked(true);
    },[bookCarts]);
    
    const handleAllCheckedChange = event => {
        const isChecked = event.target.checked;
        isChecked ? setCheckedBookCartList(bookCarts?.map(book => book.itemId)) : setCheckedBookCartList([]);
        setAllChecked(isChecked);
    };
    const handleSingleCheckedChange = (event, itemId) => {
        if (event.target.checked) {
            if (checkedBookCartList.length + 1 === bookCarts.length) {
                setAllChecked(true);
            }
            setCheckedBookCartList([...checkedBookCartList, itemId]);
        }
        else {
            setCheckedBookCartList(checkedBookCartList.filter(id => id !== itemId));
            setAllChecked(false);
        }
    };
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="2" color="text.primary">북카트</Typography>,
    ];
    
    
    return (
        <MainLayout>
            <Wrapper>
                <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
                {
                    isFetchBookCartLoading &&
                    <Box sx={{ width: 1, my: 10, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                }
                <Box sx={{ width: 1, px: 2 }}>
                    {
                        isFetchBookCartSuccess && checkedBookCartList &&
                        <Box>
                            <Box sx={{ px: 1, mb: 1, border: `1px solid ${ grey[400] }` }}>
                                <FormControlLabel
                                    label="전체 선택"
                                    control={
                                        <Checkbox
                                            checked={ isAllChecked }
                                            onChange={ handleAllCheckedChange }
                                        />
                                    }
                                />
                            </Box>
                            {
                                bookCarts.map(bookCart => {
                                    return (
                                        <Box key={ bookCart.itemId } sx={{ display: "flex", border: `1px solid ${ grey[400] }` }}>
                                            <Box sx={{ p: 1 }}>
                                                <Checkbox
                                                    checked={ checkedBookCartList.includes(bookCart.itemId) }
                                                    onChange={ event => handleSingleCheckedChange(event, bookCart.itemId) }
                                                    sx={{ width: "24px", height: "24px", boxSizing: "border-box" }}
                                                />
                                            </Box>
                                            <BookCartItem bookCart={ bookCart } />
                                        </Box>
                                    );
                                })
                            }
                            <TotalPrice checkedList={ checkedBookCartList } bookCartList={ bookCarts }/>
                        </Box>
                    }
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
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;
const Cover = styled.div`
    width: 100px;
    
    > img {
        width: 100%;
        height: 100%;
    }
`;
const Amount = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin-left: 16px;
`;
const Price = styled.ul`
    > li {
        display: flex;
        justify-content: space-between;
    }
`;
const TotalPriceWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
    padding: 8px;
    border: 1px solid ${ grey[400] };
`;
