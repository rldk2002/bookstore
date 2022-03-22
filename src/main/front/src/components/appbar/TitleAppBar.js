import React from 'react';
import { AppBar, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const TitleAppBar = ({ title }) => {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, display: { xs: 'flex', sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
                    >
                        BookStore
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                        { title }
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TitleAppBar;