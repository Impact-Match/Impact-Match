import React from 'react';
import { Table, styled } from '@mui/material';

const StyledTableComponent = styled(Table)(({ theme, minWidth }) => ({
    whiteSpace: "nowrap",
    minWidth: minWidth || 900,
    "& thead": {
        backgroundColor: "#f5f5f5",
        "& tr": {
            "& th": {
                padding: 5,
                whiteSpace: 'nowrap',
                fontSize: '0.825rem',
            }
        }
    },
    "& tbody": {
        "& tr": {
            "& td": {
                padding: 5,
                textAlign: "center",
                fontSize: '0.825rem'
            },
            "& .stickyCell": {
                position: 'sticky',
                left: 0,
                backgroundColor: '#ffffff',
                zIndex: 1,
                textAlign: 'left',
            }
        }
    }
}));

const StyledTable = ({ minWidth, children }) => {
    return <StyledTableComponent minWidth={minWidth}>{children}</StyledTableComponent>;
};

export default StyledTable;