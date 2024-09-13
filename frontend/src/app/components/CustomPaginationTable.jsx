import React from 'react';
import { TablePagination, IconButton, styled, Box, Button, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// 自定义IconButton样式
const StyledIconButton = styled(IconButton)(({ theme }) => ({
    fontSize: "18px", // 调整图标大小
    color: "#717CFF", // 淡紫色
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    "&:hover": {
        backgroundColor: "#c0c6ff", // 淡紫色的悬停效果
        color: "#ffffff"
    }
}));

// 自定义TablePagination样式
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    "& .MuiTablePagination-toolbar": {
        display: 'flex',
    },
    "& .MuiTablePagination-spacer": {
        flex: 1,
    },
    "& .MuiTablePagination-actions": {
        display: 'flex',
        alignItems: 'center',
    },
    "& .MuiSelect-root": {
        fontSize: "14px",
        color: "#717CFF",
    },
    "& .MuiTablePagination-caption": {
        fontSize: "14px",
        color: "#717CFF",
    },
}));

const PaginationButton = styled(Button)(({ theme, selected }) => ({
    minWidth: '32px',
    height: '32px',
    borderRadius: '50%',
    margin: '0 4px',
    padding: '0',
    color: selected ? '#ffffff' : '#959bf7',
    backgroundColor: selected ? '#717CFF' : 'transparent',
    "&:hover": {
        backgroundColor: selected ? '#717CFF' : '#dadcfc',
        color: selected ? '#ffffff' : '#959bf7',
    }
}));

const CustomPaginationTable = ({ page, rowsPerPage, count, handleChangePage, handleChangeRowsPerPage }) => {
    const totalPages = Math.ceil(count / rowsPerPage);
    const handlePageClick = (event, newPage) => {
        handleChangePage(event, newPage);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const ellipsis = <Typography key="ellipsis" variant="body2" color="#b0b4f8">...</Typography>;

        for (let i = 0; i < totalPages; i++) {
            if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                pageNumbers.push(
                    <PaginationButton
                        key={i}
                        onClick={(event) => handlePageClick(event, i)}
                        selected={i === page}
                    >
                        {i + 1}
                    </PaginationButton>
                );
            } else if (i === 1 || i === totalPages - 2 || (i === page - 2 && page > 2) || (i === page + 2 && page < totalPages - 3)) {
                pageNumbers.push(ellipsis);
            }
        }

        return pageNumbers;
    };

    return (
        <StyledTablePagination
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={count}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 20]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={<Typography variant="body2">Rows:</Typography>}
            ActionsComponent={(subprops) => (
                <Box className={subprops.className} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                    <StyledIconButton
                        onClick={(event) => subprops.onPageChange(event, subprops.page - 1)}
                        disabled={subprops.page === 0}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft />
                    </StyledIconButton>
                    {renderPageNumbers()}
                    <StyledIconButton
                        onClick={(event) => subprops.onPageChange(event, subprops.page + 1)}
                        disabled={subprops.page >= totalPages - 1}
                        aria-label="Next Page"
                    >
                        <ChevronRight />
                    </StyledIconButton>
                </Box>
            )}
        />
    );
};

export default CustomPaginationTable;
