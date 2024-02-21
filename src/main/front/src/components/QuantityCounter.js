import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextField } from "@mui/material";
import {
    IndeterminateCheckBox as IndeterminateCheckBoxIcon,
    AddBox as AddBoxIcon
} from '@mui/icons-material';

const QuantityCounter = ({ count = 1, getCount }) => {
    const maxValue = 99;
    const minValue = 1;
    const [value, setValue] = useState(count);
    
    
    const handleMinus = () => {
        if (value > minValue) {
            setValue(value - 1);
        }
    }
    const handlePlus = () => {
        if (value < maxValue) {
            setValue(value + 1);
        }
    }
    
    useEffect(() => {
        getCount(value);
    }, [value, getCount]);
    
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={ handleMinus } size="large"><IndeterminateCheckBoxIcon /></IconButton>
            <TextField
                sx={{ width: "64px" }}
                inputProps={{ style: { textAlign: 'center' }}}
                size="small"
                value={ value }
            />
            <IconButton onClick={ handlePlus } size="large"><AddBoxIcon /></IconButton>
        </Box>
    );
};

export default QuantityCounter;