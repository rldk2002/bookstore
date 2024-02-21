import React from 'react';
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../ajax/queryKeys";
import { default as ajax } from "../../ajax/axiosInterceptor";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { useNavigate } from "react-router";
import {
    DisabledByDefault as DisabledByDefaultIcon
} from '@mui/icons-material';
import { toast } from "react-toastify";

const BookDibsItem = ({ isbn }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const {
        isLoading: isLoadingBookSearch,
        isSuccess: isSuccessBookSearch,
        data: {
            item: book
        } = {}
    } = useQuery(
        [queryKeys.bookSearch([{ isbn: isbn }])],
        () => ajax.get(`/books/search?isbn=${ isbn }`)
    );
    
    const {
        mutateAsync: mutateAsyncRemoveBookDibs
    } = useMutation(() => ajax.delete(`/books/dibs?isbn=${isbn}`));
    
    const handleRemoveBookDibs = async () => {
        await mutateAsyncRemoveBookDibs(null, {
            onSuccess: () => {
                toast.info("찜목록에서 삭제되었습니다.");
                queryClient.invalidateQueries([queryKeys.bookDibs([queryKeywords.principal])]);
            },
            onError: error => {
                toast.error("찜목록에서 삭제에 실패했습니다.");
            }
        })
    }
    
    return (
        <Wrapper>
            {
                isLoadingBookSearch &&
                <Box sx={{ width: 1, display: "flex", justifyContent: "center", alignItems: "center", my: "50px" }}>
                    <CircularProgress />
                </Box>
            }
            {
                isSuccessBookSearch &&
                <Cover>
                    <img src={ book.image } alt={ book.title } onClick={ () => navigate(`/books/details/${isbn}`) } />
                    <Buttons>
                        <IconButton onClick={ handleRemoveBookDibs }><DisabledByDefaultIcon /></IconButton>
                    </Buttons>
                </Cover>
            }
        </Wrapper>
    );
};

export default BookDibsItem;

const Wrapper = styled.div`
    display: flex;
    flex-flow: wrap;
    justify-content: center;
`;
const Cover = styled.div`
    width: 140px;
    height: 200px;
    padding: 10px;
    border: 1px dotted #eaeaea;
    position: relative;

    > img {
        width: 100%;
        height: -webkit-fill-available;
    }
    
    &:hover {
        cursor: pointer;
    }
`;
const Buttons = styled.div`
    position: absolute;
    right: 0;
    top: 0;
`;