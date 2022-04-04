import React, { useState } from 'react';
import styled from "styled-components";
import { grey } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { Collapse, IconButton, Typography, useMediaQuery } from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon, ExpandLess, ExpandMore, Favorite as FavoriteIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const BookItem = ({ book }) => {
    const {
        itemId,
        priceSales: price,
        publisher,
        author,
        pubDate,
        title,
        coverLargeUrl: cover
    } = book;
    const matches = useMediaQuery(theme => theme.breakpoints.down('tablet'));
    const [isOpen, setOpen] = useState(false);
    const handleCollapseToggle = () => {
        setOpen(!isOpen);
    }
    
    return (
        <Wrapper>
            <BookContent>
                <Link to={ `/books/${ itemId }` }>
                    <Cover>
                        <img src={ cover } alt={ title } />
                    </Cover>
                </Link>
                <MetaData>
                    <Link to={ `/books/${ itemId }` }>
                        <Typography variant="h6" gutterBottom component="div">{ title }</Typography>
                    </Link>
                    <MetaDataList>
                        { author && <Attribute><span>저자</span>{author}</Attribute> }
                        { publisher && <Attribute><span>출판</span>{ publisher }</Attribute> }
                        { pubDate && <Attribute><span>출간일</span>{ [pubDate.slice(0, 4), ".", pubDate.slice(4, 6), ".", pubDate.slice(6, 8)].join('') }</Attribute> }
                        { price && <Attribute><span>가격</span><Price>{ `${ price.toLocaleString() }원`}</Price></Attribute> }
                    </MetaDataList>
                </MetaData>
                {
                    matches &&
                    <IconButton size="large" sx={{ position: "absolute", bottom: '8px', right: '8px' }} onClick={ handleCollapseToggle }>
                        { isOpen ? <ExpandLess /> : <ExpandMore /> }
                    </IconButton>
                }
                {
                    !matches &&
                    <DesktopButtonGroup>
                        <LoadingButton loading={ false } variant="outlined" color="error" startIcon={ <FavoriteIcon /> }>좋아요</LoadingButton>
                        <LoadingButton loading={ false } variant="outlined" color="primary" startIcon={ <AddShoppingCartIcon /> }>북카트에 담기</LoadingButton>
                        <LoadingButton loading={ false } variant="contained" color="primary">구매하기</LoadingButton>
                    </DesktopButtonGroup>
                }
            </BookContent>
            {
                matches &&
                <Collapse in={ isOpen } sx={{ backgroundColor: "white" }}>
                    <MobileButtonGroup>
                        <LoadingButton loading={ false } variant="outlined" color="error" startIcon={ <FavoriteIcon /> }>좋아요</LoadingButton>
                        <LoadingButton loading={ false } variant="outlined" color="primary" startIcon={ <AddShoppingCartIcon /> }>북카트에 담기</LoadingButton>
                        <LoadingButton loading={ false } variant="contained" color="primary">구매하기</LoadingButton>
                    </MobileButtonGroup>
                </Collapse>
            }
        </Wrapper>
    );
};

export default React.memo(BookItem);

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	padding: 4px 8px;
    
    &:first-child {
        padding-top: 8px;
    }
    &:last-child {
        padding-bottom: 8px;
    }
    ${ ({ theme }) => theme.breakpoints.down('tablet') } {
        background-color: ${ grey['100'] };
    }
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        &:not(:last-child) {
            border-bottom: 1px solid ${ grey['500'] };
        }
    }
`;
const BookContent = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    padding: 8px;
    background-color: white;
`;
const Cover = styled.div`
    width: 120px;
    
    > img {
        width: 100%;
        height: 100%;
    }
`;
const MetaData = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 16px;
`;
const MetaDataList = styled.ul``;
const Attribute = styled.li`
    padding: 4px 0;
    
    > span {
        margin-right: 16px;
        color: ${ grey['600'] };
    }
`;
const Price = styled.div`
    display: inline-block;
    font-weight: bold;
    color: red;
`;
const MobileButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
    padding-bottom: 16px;
    
    > button:not(:last-child) {
        margin-right: 8px;
    }
`;
const DesktopButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: auto;
    
    > button:not(:last-child) {
        margin-bottom: 8px;
    }
`;