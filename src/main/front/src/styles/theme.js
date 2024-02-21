import { createTheme } from "@mui/material";
/*
 *** Default breakpoints
 * xs, extra-small: 0px
 * sm, small: 600px
 * md, medium: 900px
 * lg, large: 1200px
 * xl, extra-large: 1536px
 */

const theme = createTheme({
    breakpoints: {
        keys: ['mobile', 'tablet', 'desktop'],
        values: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        }
    },
    // components: {
    //     MuiMenuItem: {
    //         styleOverrides: {
    //             root: {
    //                 minHeight: "36px"
    //             }
    //         }
    //     }
    // },
    palette: {
        main: {
            main: "#7fad39"
        }
    },
    colors: {
        main: "#7fad39"
    }
});

export default theme;