import React, { useState } from 'react';
import {
    alpha,
    AppBar, Avatar, BottomNavigation, BottomNavigationAction,
    Box,
    Button, CircularProgress,
    Container, Divider, Drawer,
    IconButton, InputBase,
    Link, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Toolbar,
    Typography
} from "@mui/material";
import {
    Menu as MenuIcon,
    Category as CategoryIcon,
    Search as SearchIcon,
    Star as StarIcon,
    NewReleases as NewReleasesIcon,
    Recommend as RecommendIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    GroupAdd as GroupAddIcon,
    ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';
import { makeStyles } from "@mui/styles";
import styled from "styled-components";
import { useAuthentication, useLogout } from "../../api/queries";
import { useQueryClient } from "react-query";
import { queryKeywords } from "../../api/queryKeys";
import { useLocation, useNavigate } from "react-router-dom";

const useStyle = makeStyles({
    Link : {
        '&:hover' : {
            color : '#fff'
        }
    }
});

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


const MainAppBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyle();
    const menus = [
        { name: '카테고리', icon: <CategoryIcon /> },
        { name: '베스트셀러', icon: <StarIcon /> },
        { name: '신규도서', icon: <NewReleasesIcon /> },
        { name: '추천도서', icon: <RecommendIcon /> },
    ];
    const [isDrawerOpen, toggleDrawer] = useState(false);
    
    const queryClient = useQueryClient();
    const { data: principal, isLoading: isLoadingPrincipal, isSuccess: isSuccessFetchPrincipal } = useAuthentication();
    const { mutateAsync: mutateAsyncLogout } = useLogout();
    
    const handleLogout = async () => {
        await mutateAsyncLogout(null, {
            onSuccess: isSuccess => {
                if (isSuccess) {
                    window.localStorage.removeItem("Authorization");
                    queryClient.invalidateQueries({
                        predicate: ({ queryKey }) => queryKey.find(key => key === queryKeywords.principal)
                    });
                }
            }
        })
    };
    
    return (
        <AppBar position="static">
            <Container maxWidth={ false }>
                <Toolbar disableGutters>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, display: { mobile: 'flex', tablet: 'none' } }}
                            onClick={ () => toggleDrawer(true) }
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: 'flex' }}
                        >
                            <Link href="/" underline="none" color="inherit" className={ classes.Link }>
                                BookStore
                            </Link>
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: { mobile: 'none', tablet: 'flex' } }}>
                            {
                                menus.map(({ name }) => {
                                    return (
                                        <Button
                                            key={name}
                                            sx={{ my: 2, color: 'white', display: 'block', width: 'max-content' }}
                                        >
                                            {name}
                                        </Button>
                                    );
                                })
                            }
                        </Box>
                        <Box />
                        <Box>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase />
                            </Search>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
            <Drawer open={ isDrawerOpen } ModalProps={{ onBackdropClick: () => toggleDrawer(false) }}>
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem>
                            { isLoadingPrincipal && <CircularProgress /> }
                            {
                                isSuccessFetchPrincipal && principal ? (
                                    <>
                                        <ListItemAvatar>
                                            <Avatar />
                                        </ListItemAvatar>
                                        <ListItemText primary={ principal.name } secondary={ principal.id } />
                                    </>
                                ) : (
                                    <ListItemText primary="로그인을 해주세요." />
                                )
                            }
                        </ListItem>
                    </List>
                    <Divider />
                    {
                        principal ? (
                            <BottomNavigation showLabels>
                                <BottomNavigationAction label="마이페이지" icon={ <ManageAccountsIcon/> } />
                                <BottomNavigationAction label="로그아웃" icon={ <LogoutIcon /> } onClick={ handleLogout } />
                            </BottomNavigation>
                        ) : (
                            <BottomNavigation showLabels>
                                <BottomNavigationAction label="회원가입" icon={ <GroupAddIcon /> } onClick={ () => navigate("/signup") }/>
                                <BottomNavigationAction label="로그인" icon={ <LoginIcon /> } onClick={ () => navigate("/login", { state: { from: location.pathname } }) }/>
                            </BottomNavigation>
                        )
                        
                    }
                    <Divider />
                    <List>
                        {
                            menus.map(({ name, icon }) => {
                                return (
                                    <ListItem key={ name } disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>{ icon }</ListItemIcon>
                                            <ListItemText primary={ name } />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default MainAppBar;