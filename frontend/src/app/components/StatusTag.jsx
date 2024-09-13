import React from 'react';
import { styled } from "@mui/material";

const Small = styled("small")(({ bgcolor, color }) => ({
    width: 'auto',
    color: color,
    padding: "4px 12px",
    borderRadius: "15px",
    overflow: "hidden",
    background: bgcolor,
    margin: "3px",
    display: "inline-block",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    fontWeight: '450',
}));

const capitalizeWords = (str) => {
    if (typeof str !== 'string') {
        return '';
    }
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

const StatusTag = ({ status, bgcolor, color }) => {
    return (
        <Small bgcolor={bgcolor} color={color}>
            {capitalizeWords(status)}
        </Small>
    );
};

export default StatusTag;