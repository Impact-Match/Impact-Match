// ProductsTag.jsx
import React from 'react';
import { styled } from "@mui/material";

const Small = styled("small")(({ bgcolor, color }) => ({
    width: 'auto',
    color: color,
    padding: "5px 12px", // Increased padding
    borderRadius: "12px",
    overflow: "hidden",
    background: bgcolor,
    marginLeft: "5px",
    display: "inline-block",
    fontSize: "0.9rem", // Increased font size
    lineHeight: "1", // Adjusted line height for better readability
    fontWeight: '450',
}));

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

const ProductsTag = ({ tag, bgcolor, color }) => {
    return (
        <Small bgcolor={bgcolor} color={color}>
            {capitalizeWords(tag)}
        </Small>
    );
};

export default ProductsTag;
