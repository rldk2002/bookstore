import React, { useState, Fragment, useEffect } from 'react';
import {
    alpha,
    AppBar,
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Container,
    Dialog, DialogContent, DialogTitle,
    Divider,
    Drawer, Fade, IconButton, InputAdornment,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Slide, TextField,
    Toolbar,
    Typography,
    useMediaQuery
} from "@mui/material";
import {
    Menu as MenuIcon,
    LibraryBooks as LibraryBooksIcon,
    Search as SearchIcon,
    Star as StarIcon,
    NewReleases as NewReleasesIcon,
    Recommend as RecommendIcon,
    Close as CloseIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    GroupAdd as GroupAddIcon,
    Delete as DeleteIcon,
    ManageAccounts as ManageAccountsIcon, ExpandLess, ExpandMore
} from '@mui/icons-material';
import { makeStyles } from "@mui/styles";
import styled from "styled-components";
import { useAuthentication, useLogout } from "../../api/queries";
import { useQueryClient } from "react-query";
import { queryKeywords } from "../../api/queryKeys";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { loadSearchHistory, removeSearchHistory, saveSearchHistory } from "../../services/localStorageService";
import { blue } from "@mui/material/colors";

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
            width: '300px',
        },
    },
}));

const TransitionUp = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const TransitionFade = React.forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
});

const MainAppBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyle();
    const matches = useMediaQuery(theme => theme.breakpoints.down('tablet'));
    const [isDrawerOpen, toggleDrawer] = useState(false);   // 모바일 화면 좌측 햄버거 메뉴 toggle
    const [isDomesticBookListOpen, setDomesticBookListOpen] = useState(false);  // 국내도서 카테고리 리스트 toggle
    const [isOverseasBookListOpen, setOverseasBookListOpen] = useState(false);  // 해외도서 카테고리 리스트 toggle
    const [categories, setCategories] = useState({});   // 인터파크 도서 카테고리 정보
    const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);  // 검색창(모바일) dialog toggle
    
    useEffect(() => {
        fetch("/book/interpark_book_categories.txt")
            .then(r => r.text())
            .then(text => {
                let map = {};
                text.replace(/(\b[^=]+)=([^\n]+)\n/g, ($0, key, value) => {
                    map[key] = value;
                    return ;
                });
                setCategories(map);
            });
    }, []);
    
    const menus = [
        { name: '국내도서', icon: <LibraryBooksIcon />, action: () => setDomesticBookListOpen(!isDomesticBookListOpen), nested: true },
        { name: '해외도서', icon: <LibraryBooksIcon />, action: () => setOverseasBookListOpen(!isOverseasBookListOpen), nested: true },
        { name: '베스트셀러', icon: <StarIcon />, nested: false },
        { name: '신규도서', icon: <NewReleasesIcon />, nested: false },
        { name: '추천도서', icon: <RecommendIcon />, nested: false },
    ];
    
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
    
    const [query, setQuery] = useState(''); // 도서 검색어
    const [queryHistory, setQueryHistory] = useState(loadSearchHistory);
    const handlePressEnter = event => {
        if (event.key === 'Enter') {
            saveSearchHistory(query);
            setQueryHistory(loadSearchHistory);
            setSearchDialogOpen(false);
            redirectSearchResultPage(query);
        }
    }
    const handleSearchButtonClick = () => {
        saveSearchHistory(query);
        setSearchDialogOpen(false)
        redirectSearchResultPage(query);
    }
    
    const handleSearchQueryClick = query => {
        saveSearchHistory(query);
        setQueryHistory(loadSearchHistory);
        setSearchDialogOpen(false);
        redirectSearchResultPage(query);
    };
    const handleRemoveQueryHistory = query => {
        removeSearchHistory(query);
        setQueryHistory(loadSearchHistory);
    }
    
    function redirectSearchResultPage(query) {
        navigate({
            pathname: '/books/search',
            search: `${ createSearchParams({ query: query }) }`
        });
    }
    
    return (
        <>
            <AppBar position="static">
                {
                    // 데스크톱 화면 최상단 작은 Appbar
                    !matches &&
                    <Box sx={{ display: "flex", px: 3, py: 0.5, backgroundColor: blue['800'] }}>
                        <NavGroup>
                            <Link component="button" underline="none" sx={{ color: "white" }} onClick={ () => navigate("/signup") }>회원가입</Link>
                            <Link
                                component="button"
                                underline="none"
                                sx={{ color: "white" }}
                                onClick={ () => navigate("/login", { state: { from: location.pathname } }) }
                            >
                                로그인
                            </Link>
                        </NavGroup>
                    </Box>
                }
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
                                                key={ name }
                                                sx={{ my: 2, color: 'white', display: 'block', width: 'max-content' }}
                                            >
                                                { name }
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
                                    <StyledInputBase onClick={ () => setSearchDialogOpen(true) }/>
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
                                menus.map(({ name, icon, action, nested }) => {
                                    return (
                                        <Fragment key={ name }>
                                            <ListItemButton onClick={ action }>
                                                <ListItemIcon>{ icon }</ListItemIcon>
                                                <ListItemText primary={ name } />
                                                { nested && ( isDomesticBookListOpen ? <ExpandLess /> : <ExpandMore />) }
                                            </ListItemButton>
                                            {
                                                nested && name === '국내도서' && isDomesticBookListOpen &&
                                                <Collapse in={ isDomesticBookListOpen } timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {
                                                            Object.entries(categories)
                                                                .filter(([key, value]) => value.startsWith("국내도서>"))
                                                                .map(([key, value]) => [key, value.substring("국내도서>".length)])
                                                                .map(([key, value]) => {
                                                                    return (
                                                                        <ListItemButton
                                                                            sx={{ pl: 4 }}
                                                                            key={ key }
                                                                            onClick={() => navigate(`/books/category/${ key }`)}
                                                                        >
                                                                            { value }
                                                                        </ListItemButton>
                                                                    );
                                                                })
                                                        }
                                                    </List>
                                                </Collapse>
                                            }
                                            {
                                                nested && name === '해외도서' && isOverseasBookListOpen &&
                                                <Collapse in={ isOverseasBookListOpen } timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {
                                                            Object.entries(categories)
                                                                .filter(([key, value]) => value.startsWith("외국도서>"))
                                                                .map(([key, value]) => [key, value.substring("외국도서>".length)])
                                                                .map(([key, value]) => {
                                                                    return (
                                                                        <ListItemButton
                                                                            sx={{ pl: 4 }}
                                                                            key={ key }
                                                                            onClick={() => navigate(`/books/category/${ key }`)}
                                                                        >
                                                                            { value }
                                                                        </ListItemButton>
                                                                    );
                                                                })
                                                        }
                                                    </List>
                                                </Collapse>
                                            }
                                        </Fragment>
                                    );
                                })
                            }
                        </List>
                    </Box>
                </Drawer>
            </AppBar>
            <Dialog // 검색창 클릭시 나오는 검색어 히스토리 창
                fullScreen={ matches }
                open={ isSearchDialogOpen }
                onClose={ () => setSearchDialogOpen(false) }
                TransitionComponent={ matches ? TransitionUp : TransitionFade }
            >
                {
                    matches &&
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setSearchDialogOpen(false)}
                            >
                                <CloseIcon/>
                            </IconButton>
                            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">도서 검색</Typography>
                        </Toolbar>
                    </AppBar>
                }
                { !matches && <DialogTitle>도서 검색</DialogTitle> }
                <DialogContent sx={{ width: { tablet: '500px' } }}>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="검색어를 입력하세요."
                        variant="standard"
                        autoComplete="off"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={ handleSearchButtonClick }><SearchIcon /></IconButton>
                                </InputAdornment>
                            )
                        }}
                        onKeyPress={ handlePressEnter }
                        onChange={ event => setQuery(event.target.value) }
                    />
                    <List>
                        {
                            queryHistory.slice(0).reverse().map(query => {
                                return (
                                    <ListItem
                                        key={ query }
                                        secondaryAction={
                                            <IconButton edge="end" onClick={ () => handleRemoveQueryHistory(query) }>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemButton sx={{ pl: 0, py: 0 }} onClick={ () => handleSearchQueryClick(query) }>
                                            <ListItemText primary={ query } />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MainAppBar;

const NavGroup = styled.div`
    margin-left: auto;
    
    > button:not(:first-child) {
        padding-left: 8px;
    }
`;