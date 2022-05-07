import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

const TitleAppBar = ({ title }) => {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ position: "relative" }}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: 'flex' }}
                    >
                        BookStore
                    </Typography>
                    <Box sx={{ position: "absolute", width: 1, textAlign: "center" }}>
                        <Typography variant="subtitle" component="div" >
                            { title }
                        </Typography>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TitleAppBar;