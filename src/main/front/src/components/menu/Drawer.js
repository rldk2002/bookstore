import React, { useState } from 'react';
import { Button, Drawer, IconButton } from "@mui/material";
import { Favorite as FavoriteIcon, Menu as MenuIcon, ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";

const MenuDrawer = () => {
    const [isOpen, setOpen] = useState(false);
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    
    const queryClient = useQueryClient();
    
    const {
        isSuccess: isAuthenticationSuccess,
        data: isAuthentication
    } = useQuery(
        [queryKeywords.principal],
        () => ajax.get("/members/authentication")
    );
    
    const {
        mutateAsync: mutateAsyncLogout
    } = useMutation({
        mutationFn: () => ajax.post("/members/logout")
    });
    
    const handleLogout = async () => {
        await mutateAsyncLogout(null, {
            onSuccess: data => {
                window.localStorage.removeItem("Authorization");
                queryClient.invalidateQueries({
                    predicate: query => query.queryKey[query.queryKey.length - 1] === queryKeywords.principal
                })
            }
        })
    };

    const pages = ['베스트셀러', '신규도서', '추천도서'];

    return (
        <React.Fragment>
            <IconButton
                size="large"
                color="inherit"
                onClick={ () => openDrawer(true) }
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={ isOpen }
                onClose={ () => closeDrawer(false) }
            >
                <ContentArea>
                    <Logo>
                        <img src="/BookStore_Logo.png" alt="로고" />
                    </Logo>
                    <DrawerCart>
                        <IconButton href="/members/books/dibs"><FavoriteIcon /></IconButton>
                        <IconButton href="/members/books/cart"><ShoppingBagIcon /></IconButton>
                    </DrawerCart>
                    {
                        isAuthenticationSuccess && isAuthentication &&
                        <DrawerLogin>
                            <Button size="small" href="/members/mypage" sx={{ color: "#000000" }}>마이페이지</Button>
                            <Button size="small" onClick={ handleLogout } sx={{ color: "#000000" }}>로그아웃</Button>
                        </DrawerLogin>
                    }
                    {
                        isAuthenticationSuccess && !isAuthentication &&
                        <DrawerLogin>
                            <Button size="small" href="/members/signup" sx={{ color: "#000000" }}>회원가입</Button>
                            <Button size="small" href="/members/login" sx={{ color: "#000000" }}>로그인</Button>
                        </DrawerLogin>
                    }
                    <DrawerMenu>
                        {
                            pages.map(page => {
                                return (
                                    <div key={ page }>
                                        <DrawerMenuButton key={ page }>{ page }</DrawerMenuButton>
                                    </div>
                                );
                            })
                        }
                    </DrawerMenu>
                </ContentArea>
            </Drawer>
        </React.Fragment>
    );
};

export default MenuDrawer;

const ContentArea = styled.div`
    width: 300px;
    padding: 50px 30px 30px 30px;
    box-sizing: border-box;
`;
const Logo = styled.div`
    > img {
        width: 120px;
        height: 50px;
    }
`;
const DrawerLogin = styled.div`
    margin-bottom: 20px;
`;
const DrawerCart = styled.div`
    display: flex;
    justify-content: flex-start;
    margin: 30px 0 25px 0;
    
    > button {
        color: #000000;
    }
`;
const DrawerMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > div:not(:last-child) {
        width: 100%;
        border-bottom: 1px solid #e1e1e1;
    }
`;
const DrawerMenuButton = styled(Button)`
    display: block;
    margin: 16px 0;
    font-size: 16px !important;
    font-weight: bold !important;
    color: #000000 !important;
`;