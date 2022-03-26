import { createTheme } from "@mui/material";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 768,
            md: 992,
            lg: 1200,
            xl: 1536,
            mobile: 0,
            tablet: 768,
            laptop: 992,
            desktop: 1200,
        },
    }
});

export default theme;