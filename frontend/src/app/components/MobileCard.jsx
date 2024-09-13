import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { ProductCard, StatusTag } from "../components";

const MobileCard = ({ product, bgPrimary, bgError, colorSigned, colorUnsigned }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 3,
            marginBottom: 2,
            border: '1px solid #ddd',
            borderRadius: 3,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
        }}
    >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <ProductCard
                imageUrl={product.featuredImage.url}
                title={product.title}
                linkUrl={product.onlineStoreUrl}
                isSquare={true}
            />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2">
                <strong>Product ID: </strong> <span style={{ marginLeft: 8 }}>{product.product_shopify_id}</span>
            </Typography>
            <Box display="flex" alignItems="center">
                <Typography variant="body2">
                    <strong>Status: </strong> <span style={{ marginLeft: 8 }}>{product.status}</span>
                </Typography>
                <StatusTag
                    status={product.status ? "Signed" : "Unsigned"}
                    bgcolor={product.status ? bgPrimary : bgError}
                    color={product.status ? colorSigned : colorUnsigned}
                    sx={{ ml: 1 }}
                />
            </Box>
            <Typography variant="body2">
                <strong>Start Time: </strong> <span style={{ marginLeft: 8 }}>{product.start_time}</span>
            </Typography>
            <Typography variant="body2">
                <strong>End Time: </strong> <span style={{ marginLeft: 8 }}>{product.end_time}</span>
            </Typography>
            <Typography variant="body2">
                <strong>Commission: </strong> <span style={{ marginLeft: 8 }}>{product.commission_rate}</span>
            </Typography>
        </Box>
    </Box>
);

export default MobileCard;