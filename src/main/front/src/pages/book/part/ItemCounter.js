import React, { useEffect, useState } from 'react';
import { Box, TextField } from "@mui/material";
import { AddCircleOutline as AddIcon, RemoveCircleOutline as RemoveIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const ItemCounter = ({
        initCount = 1,
        min = 1,
        max= 99,
        onCountChange: handleCountChange = () => {}
}) => {
    const [count, setCount] = useState(initCount);
    
    useEffect(() => {
        handleCountChange(count);
    }, [count, handleCountChange]);
    
    const handleChange = event => {
        const value = event.target.value.replace(/[^0-9]/, "").replace(/(^0+)/, "");
        setCount(value);
    };
    const handleNumberBoxBlur = event => {
        const value = event.target.value;
        
        if (value > max) {
            alert(`주문수량은 최대 ${ max }개입니다.`);
            setCount(max);
        }
        if (value < min) {
            alert(`주문수량은 최소 ${ min }개 이상입니다.`);
            setCount(min);
        }
    };
    const handlePlusClick = () => {
        if (count < max) {
            setCount(count + 1);
        } else {
            alert(`주문수량은 최대 ${ max }개입니다.`);
        }
    };
    const handleMinusClick = () => {
        if (count > min) {
            setCount(count - 1);
        } else {
            alert(`주문수량은 최소 ${ min }개 이상입니다.`);
        }
    };
    
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <LoadingButton loading={ false } size="small" onClick={ handlePlusClick }><AddIcon /></LoadingButton>
            <TextField
                size="small"
                sx={{ width: "50px" }}
                inputProps={{ min: 1, style: { textAlign: 'center' }}}
                value={ count }
                onChange={ handleChange }
                onBlur={ handleNumberBoxBlur }
                autoComplete="off"
            />
            <LoadingButton loading={ false } size="small" onClick={ handleMinusClick }><RemoveIcon /></LoadingButton>
        </Box>
    );
};

export default ItemCounter;