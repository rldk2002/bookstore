import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import styled from "styled-components";
import {
    Favorite as FavoriteIcon,
    ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import MenuDrawer from "../menu/Drawer";
import { Link } from "react-router-dom";
import SearchBox from "../SearchBox";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";

const MainAppbar = () => {
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
    
    const pages = [
        { name: '베스트셀러', url: "/books/bestseller/category/100" },
        { name: '신규도서', url: "/books/newBook" },
        { name: '추천도서', }
    ];
    
    return (
        <AppBar position="static" sx={{ bgcolor: "#fff" }}>
            <AuthenticationSection>
                <SectionContentWrap>
                    <Toolbar sx={{ width: 1, justifyContent: "space-between", boxSizing: "border-box" }}>
                        <Typography>전화번호 또는 이메일</Typography>
                        {
                            isAuthenticationSuccess && isAuthentication &&
                            <Box>
                                <Button size="small" href="/members/mypage" sx={ {color: "#000000"} }>마이페이지</Button>
                                <Button size="small" onClick={ handleLogout } sx={ {color: "#000000"} }>로그아웃</Button>
                            </Box>
                        }
                        {
                            isAuthenticationSuccess && !isAuthentication &&
                            <Box>
                                <Button size="small" href="/members/signup" sx={ {color: "#000000"} }>회원가입</Button>
                                <Button size="small" href="/members/login" sx={ {color: "#000000"} }>로그인</Button>
                            </Box>
                        }
                    </Toolbar>
                </SectionContentWrap>
            </AuthenticationSection>
            <MenuSection>
                <SectionContentWrap>
                    <Toolbar sx={{ width: 1, boxSizing: "border-box" }}>
                        <Logo>
                            <img src="/BookStore_Logo.png" alt="로고" />
                        </Logo>
                        <HeaderMenu>
                        {
                            pages.map(({ name, url }) => {
                                return (
                                    <HeaderMenuButton
                                        key={ name }
                                        component={ Link }
                                        to={ url }
                                    >{ name }</HeaderMenuButton>
                                );
                            })
                        }
                        </HeaderMenu>
                        <HeaderCart>
                            <IconButton href="/members/books/dibs"><FavoriteIcon /></IconButton>
                            <IconButton href="/members/books/cart"><ShoppingBagIcon /></IconButton>
                        </HeaderCart>
                        <MenuButton>
                            <MenuDrawer />
                        </MenuButton>
                    </Toolbar>
                </SectionContentWrap>
            </MenuSection>
            <SearchSection>
                <SectionContentWrap>
                    <Toolbar sx={{ width: 1, boxSizing: "border-box" }}>
                        <SearchBox />
                    </Toolbar>
                </SectionContentWrap>
            </SearchSection>
        </AppBar>
    );
};

export default MainAppbar;

const AppBarSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;
const AuthenticationSection = styled(AppBarSection)`
    background-color: #f5f5f5;

    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        display: none;
    }
`;
const MenuSection = styled(AppBarSection)`
    height: 80px;
`;
const SearchSection = styled(AppBarSection)`
    height: 80px;
`;
const SectionContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: #000000;
    box-sizing: border-box;
  
    Button {
        color: #000000;
    }
    
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 760px;
    }

    ${ ({ theme }) => theme.breakpoints.up('desktop') } {
        width: 1000px;
    }
`;
const HeaderMenuButton = styled(Button)`
    display: block;
    margin: 16px 0;
    font-weight: bold !important;
    
    &:hover {
        color: ${({ theme }) => theme.colors.main };
    }
`;
const Logo = styled.div`
    flex: 1;
    
    > img {
        width: 120px;
        height: 50px;
    }
`;
const HeaderMenu = styled.div`
    display: flex;
    flex: 3;
    
    > a {
        color: #000000;
    }

    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        display: none;
    }
`;
const HeaderCart = styled.div`
    display: flex;
    justify-content: flex-end;
    flex: 1;

    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        display: none;
    }
`;
const MenuButton = styled.div`
    border: 1px solid;
    
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        display: none;
    }
`;