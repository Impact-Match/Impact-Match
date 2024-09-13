import React, { useState, useEffect, useRef } from "react";
import { Box, Card, MenuItem, Select, styled, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ProductCard, MatxLoading } from "../../../components";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
    display: "flex",
    paddingLeft: "24px",
    paddingRight: "24px",
    marginBottom: "12px",
    alignItems: "center",
    justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
    fontSize: "1rem",
    fontWeight: "500",
    textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
    minWidth: 400,
    whiteSpace: "pre",
    "& small": {
        width: 50,
        height: 15,
        borderRadius: 500,
        boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
    },
    "& td": { borderBottom: "none", textAlign: "center" },
    "& td:first-of-type": { paddingLeft: "16px !important" }
}));

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const truncateToTwoDecimals = (num) => {
    return Math.floor(num * 100) / 100;
};

export default function TopSellingProducts({ productsData, range }) {
    const [selectedMonth, setSelectedMonth] = useState(range[0]); // Set to the latest month initially
    const commissionRef = useRef(null);

    useEffect(() => {
        if (range && range.length > 0) {
            setSelectedMonth(range[0]); // Update to the latest month if range changes
        }
    }, [range]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    if (!productsData) {
        return (
            <Card sx={{ pt: "200px", alignItems: "center" }}>
                <MatxLoading />
            </Card>
        );
    }

    const monthData = productsData.find((item) => Object.keys(item)[0] === selectedMonth);
    const products = monthData ? monthData[selectedMonth] : [];

    return (
        <Card elevation={3} sx={{ pt: "20px", mb: 3, pb: "20px" }}>
            <CardHeader>
                <Title>Top Selling Products</Title>
                <Select size="small" value={selectedMonth} onChange={handleMonthChange}>
                    {range.map((month, index) => {
                        const [year, monthIndex] = month.split("-");
                        const monthString = `${monthNames[parseInt(monthIndex, 10) - 1]} ${year}`;
                        return (
                            <MenuItem key={index} value={month}>
                                {monthString}
                            </MenuItem>
                        );
                    })}
                </Select>
            </CardHeader>

            <Box overflow="auto">
                <ProductTable id="top-sell-product-table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={3} sx={{ px: 3 }}>
                                Name
                            </TableCell>
                            <TableCell colSpan={2} sx={{ px: 0, textAlign: "center" }}>
                                Units Sold
                            </TableCell>
                            <TableCell colSpan={2} ref={commissionRef} id="commission-row" sx={{ px: 0, textAlign: "center" }}>
                                Commission
                            </TableCell>
                            <TableCell colSpan={2} sx={{ px: 0, textAlign: "center" }}>
                                Revenue
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <TableRow key={index} hover>
                                    <TableCell colSpan={3} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                                        <ProductCard
                                            imageUrl={product.imgUrl}
                                            title={product.product_name}
                                            linkUrl={product.onlineStoreUrl}
                                            isSquare={true}
                                        />
                                    </TableCell>
                                    <TableCell colSpan={2} sx={{ px: 0, textTransform: "none", textAlign: "center" }}>
                                        {product.unitsSold}
                                    </TableCell>
                                    <TableCell align="center" colSpan={2} sx={{ px: 0, textTransform: "none", textAlign: "center" }}>
                                        {product.commission}
                                    </TableCell>
                                    <TableCell align="center" colSpan={2} sx={{ px: 0, textTransform: "capitalize", textAlign: "center" }}>
                                        ${truncateToTwoDecimals(product.revenue)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ height: "500px" }}>
                                    <Typography variant="body2" color="textSecondary">
                                        No data now
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </ProductTable>
            </Box>
        </Card>
    );
}
