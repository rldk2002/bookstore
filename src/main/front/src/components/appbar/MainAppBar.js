import React, { useState, Fragment, useContext } from 'react';
import {
    alpha,
    AppBar,
    Avatar, Badge,
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
    ManageAccounts as ManageAccountsIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    ExpandLess, ExpandMore
} from '@mui/icons-material';
import { makeStyles } from "@mui/styles";
import styled from "styled-components";
import { useAuthentication, useFetchBookCartSize, useLogout } from "../../api/queries";
import { useQueryClient } from "react-query";
import { queryKeywords } from "../../api/queryKeys";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { loadSearchHistory, removeSearchHistory, saveSearchHistory } from "../../services/localStorageService";
import { blue } from "@mui/material/colors";
import BookCategoryContext from "../../context/BookCategoryContext";

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
    const categoryNameContext = useContext(BookCategoryContext);
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyle();
    const matches = useMediaQuery(theme => theme.breakpoints.down('tablet'));
    const [isDrawerOpen, toggleDrawer] = useState(false);   // 모바일 화면 좌측 햄버거 메뉴 toggle
    const [isDomesticBookListOpen, setDomesticBookListOpen] = useState(false);  // 국내도서 카테고리 리스트 toggle
    const [isOverseasBookListOpen, setOverseasBookListOpen] = useState(false);  // 해외도서 카테고리 리스트 toggle
    const [isDomesticBookDropDownOpen, setDomesticBookDropDownOpen] = useState(false);  // 국내도서 카테고리 dropdown
    const [isOverseasBookDropDownOpen, setOverseasBookDropDownOpen] = useState(false);  // 해외도서 카테고리 dropdown
    const [activeMenuIndex, setActiveMenuIndex] = useState('');
    const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);  // 검색창(모바일) dialog toggle
    
    const menus = [
        { name: '베스트셀러', action: () => navigate("/books/bestSeller") },
        { name: '새로나온책', action: () => navigate("/books/newBook") },
        { name: '추천도서', action: () => navigate("/books/recommend") },
        { name: '국내도서', action: () => handleDomesticBookDropDown() },
        { name: '해외도서', action: () => handleOverseasBookDropDown() },
    ];
    const menusMobile = [
        { name: '베스트셀러', icon: <StarIcon />, action: () => navigate("/books/bestSeller"), nested: false },
        { name: '새로나온책', icon: <NewReleasesIcon />, action: () => navigate("/books/newBook"), nested: false },
        { name: '추천도서', icon: <RecommendIcon />, action: () => navigate("/books/recommend"), nested: false },
        { name: '국내도서', icon: <LibraryBooksIcon />, action: () => setDomesticBookListOpen(!isDomesticBookListOpen), nested: true },
        { name: '해외도서', icon: <LibraryBooksIcon />, action: () => setOverseasBookListOpen(!isOverseasBookListOpen), nested: true },
    ];
    
    const queryClient = useQueryClient();
    const { data: principal, isLoading: isLoadingPrincipal, isSuccess: isSuccessFetchPrincipal } = useAuthentication();
    const { mutateAsync: mutateAsyncLogout } = useLogout();
    
    const { data: cartSize = 0 } = useFetchBookCartSize();
    
    const handleLogout = async () => {
        await mutateAsyncLogout(null, {
            onSuccess: isSuccess => {
                if (isSuccess) {
                    window.localStorage.removeItem("Authorization");
                    queryClient.invalidateQueries({
                        predicate: ({ queryKey }) => queryKey.find(key => key === queryKeywords.principal)
                    });
                }
            },
            onError: error => {
                alert("로그아웃 실패");
            }
        })
    };
    
    const handleDomesticBookDropDown = () => {
        setDomesticBookDropDownOpen(!isDomesticBookDropDownOpen);
        setOverseasBookDropDownOpen(false);
        isDomesticBookDropDownOpen ? setActiveMenuIndex('') : setActiveMenuIndex('3');
        
    };
    const handleOverseasBookDropDown = () => {
        setOverseasBookDropDownOpen(!isOverseasBookDropDownOpen);
        setDomesticBookDropDownOpen(false);
        isOverseasBookDropDownOpen ? setActiveMenuIndex('') : setActiveMenuIndex('4');
    };
    
    const [query, setQuery] = useState(''); // 도서 검색어
    const [queryHistory, setQueryHistory] = useState(loadSearchHistory);
    const handlePressEnter = event => {
        if (event.key === 'Enter') {
            if (query.trim() === '') {
                alert("검색어를 입력하세요.");
            } else {
                saveSearchHistory(query);
                setQueryHistory(loadSearchHistory);
                setSearchDialogOpen(false);
                redirectSearchResultPage(query);
            }
        }
    }
    const handleSearchButtonClick = () => {
        if (query.trim() === '') {
            alert("검색어를 입력하세요.");
        } else {
            saveSearchHistory(query);
            setSearchDialogOpen(false)
            redirectSearchResultPage(query);
        }
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
    function redirectLogin() {
        navigate("/login", { state: { from: location.pathname + location.search } });
    }
    
    return (
        <>
            <AppBar position="static">
                {
                    // 데스크톱 화면 최상단 작은 Appbar
                    !matches && (
                        <Box sx={{ display: "flex", px: 3, py: 0.5, backgroundColor: blue['800'] }}>
                            {
                                principal ? (
                                    <NavGroup>
                                        <Link component="button" underline="none" sx={{ color: "white" }} onClick={ () => navigate("/books/cart") }>
                                            북카트{ cartSize > 0 && `(${ cartSize })` }
                                        </Link>
                                        <Link component="button" underline="none" sx={{ color: "white" }}>마이페이지</Link>
                                        <Link
                                            component="button"
                                            underline="none"
                                            sx={{ color: "white" }}
                                            onClick={ handleLogout }
                                        >
                                            로그아웃
                                        </Link>
                                    </NavGroup>
                                ) : (
                                    <NavGroup>
                                        <Link component="button" underline="none" sx={{ color: "white" }} onClick={ () => navigate("/signup") }>회원가입</Link>
                                        <Link
                                            component="button"
                                            underline="none"
                                            sx={{ color: "white" }}
                                            onClick={ redirectLogin }
                                        >
                                            로그인
                                        </Link>
                                    </NavGroup>
                                )
                            }
                        </Box>
                    )
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
                                    menus.map(({ name, action }, index) => {
                                        return (
                                            <Button
                                                key={ index }
                                                sx={{ my: 2, color: 'white', display: 'block', width: 'max-content' }}
                                                onClick={ action }
                                            >
                                                { name }
                                                {
                                                    activeMenuIndex === index.toString() &&
                                                    <DropDownActive index={ index }>*</DropDownActive>
                                                }
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
                {
                    !matches &&
                    <Collapse in={ isDomesticBookDropDownOpen }>
                        <DropDownMenu>
                            <DropDownMenuNav>
                                {
                                    Object.entries(categoryNameContext)
                                        .filter(([key, value]) => value.startsWith("국내도서>"))
                                        .map(([key, value]) => [key, value.substring("국내도서>".length)])
                                        .map(([key, value]) => {
                                            return (
                                                <Link
                                                    key={ key }
                                                    href={ `/books/category/${ key }` }
                                                    underline="hover"
                                                >
                                                    { value }
                                                </Link>
                                            );
                                        })
                                }
                            </DropDownMenuNav>
                        </DropDownMenu>
                    </Collapse>
                }
                {
                    !matches &&
                    <Collapse in={ isOverseasBookDropDownOpen }>
                        <DropDownMenu>
                            <DropDownMenuNav>
                                {
                                    Object.entries(categoryNameContext)
                                        .filter(([key, value]) => value.startsWith("외국도서>"))
                                        .map(([key, value]) => [key, value.substring("외국도서>".length)])
                                        .map(([key, value]) => {
                                            return (
                                                <Link
                                                    key={ key }
                                                    href={ `/books/category/${ key }` }
                                                    underline="hover"
                                                >
                                                    { value }
                                                </Link>
                                            );
                                        })
                                }
                            </DropDownMenuNav>
                        </DropDownMenu>
                    </Collapse>
                }
                <Drawer open={ isDrawerOpen } ModalProps={{ onBackdropClick: () => toggleDrawer(false) }}>
                    <Box sx={{ width: 300 }}>
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
                                <BottomNavigation showLabels sx={{ height: "72px" }}>
                                    <BottomNavigationAction label="마이페이지" icon={ <ManageAccountsIcon/> } />
                                    <BottomNavigationAction
                                        label="북카트"
                                        icon={ cartSize > 0 ? <Badge badgeContent={ cartSize } color="primary"><ShoppingCartOutlinedIcon /></Badge> : <ShoppingCartOutlinedIcon /> }
                                        onClick={ () => navigate("/books/cart") }
                                    />
                                    <BottomNavigationAction label="로그아웃" icon={ <LogoutIcon /> } onClick={ handleLogout } />
                                </BottomNavigation>
                            ) : (
                                <BottomNavigation showLabels sx={{ height: "72px" }}>
                                    <BottomNavigationAction label="회원가입" icon={ <GroupAddIcon /> } onClick={ () => navigate("/signup") }/>
                                    <BottomNavigationAction label="로그인" icon={ <LoginIcon /> } onClick={ redirectLogin }/>
                                </BottomNavigation>
                            )
                            
                        }
                        <Divider />
                        <List>
                            {
                                menusMobile.map(({ name, icon, action, nested }) => {
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
                                                            Object.entries(categoryNameContext)
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
                                                            Object.entries(categoryNameContext)
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
const DropDownMenu = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 16px 0;
    background-color: ${ blue['100'] };
`;
const DropDownMenuNav = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
    
    > a {
        width: 152px;
        padding: 4px 0;
        text-align: center;
        color: black;
        
        &:hover {
            color: ${ blue['800'] };
        }
    }
`;
const DropDownActive = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: -12px;
    left: 0;
`;