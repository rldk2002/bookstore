import { useMediaQuery } from "react-responsive";

const size = {
    tablet: "600px",
    desktop: "992px",
    wide: "1200px"
}

export const device = {
    tablet: `(min-width: ${ size.tablet })`,
    desktop: `(min-width: ${ size.desktop })`,
    wide: `(min-width: ${ size.wide })`
};

export const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return isMobile ? children : null;
}

export const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768 });
    return isTablet ? children : null;
}

export const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    return isDesktop ? children : null;
}

export const Wide = ({ children }) => {
    const isWide = useMediaQuery({ minWidth: 1200 });
    return isWide ? children : null;
}