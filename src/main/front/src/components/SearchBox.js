import React from 'react';
import { Box, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Search as SearchIcon
} from '@mui/icons-material';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
    const navigate = useNavigate();

    const schema = yup.object().shape({
        query: yup.string().required()
    });

    const { register, handleSubmit } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema)
    });

    const handleValidatedForm = async form => {
        navigate(`/books/search?query=${ form.query }`);
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: 1 }}>
            <SearchForm onSubmit={ handleSubmit(handleValidatedForm) }>
                <FormControl>
                    <OutlinedInput
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    type="submit"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        fullWidth
                        autoComplete="off"
                        placeholder="검색어를 입력하세요"
                        { ...register("query") }
                    />
                </FormControl>
            </SearchForm>
        </Box>
    );
};

export default SearchBox;

const SearchForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    ${({ theme }) => theme.breakpoints.up("tablet")} {
        width: 400px;
        padding: 0 20px;
        box-sizing: border-box;
    }
`;