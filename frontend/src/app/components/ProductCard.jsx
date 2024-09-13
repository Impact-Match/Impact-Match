import React from 'react';
import { Avatar, styled, Tooltip } from "@mui/material";

const SquareAvatar = styled(Avatar)(({ isSquare }) => ({
    borderRadius: isSquare ? 6 : '50%', // Conditional border radius
    overflow: 'hidden'
}));
const ProductLink = styled("a")({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none', // Removes underline from links
    color: 'inherit' // Inherits text color from parent
});

const ProductTitle = styled("div")({
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: 10,
    whiteSpace: 'normal',
    textAlign: 'left',
    wordBreak: 'break-word'
});

const ProductCard = ({ imageUrl, title, linkUrl, isSquare }) => (
    <ProductLink href={linkUrl} target="_blank" rel="noopener noreferrer">
        <SquareAvatar src={imageUrl} isSquare={isSquare} />
        <Tooltip title={title} arrow placement="top">
            <ProductTitle>{title}</ProductTitle>
        </Tooltip>
    </ProductLink>
);

export default ProductCard;
