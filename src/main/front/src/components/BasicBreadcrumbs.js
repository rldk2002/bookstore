import React from 'react';
import { Box, Breadcrumbs } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

const BasicBreadcrumbs = ({ breadcrumbs }) => {
    return (
        <Box sx={{ maxWidth: 'desktop', width: 1 }}>
            <Breadcrumbs
                separator={ <NavigateNext fontSize="small" /> }
                aria-label="breadcrumb"
                sx={{ px: 2, py: 2 }}
            >
                { breadcrumbs }
            </Breadcrumbs>
        </Box>
    );
};

export default BasicBreadcrumbs;