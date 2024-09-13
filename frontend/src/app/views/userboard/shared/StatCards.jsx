import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import { ArrowForwardIos, AttachMoney, ShoppingCart } from "@mui/icons-material";
import { Small } from "app/components/Typography";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px !important",
    height: "80px",
    background: theme.palette.background.paper,
    [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const DoubleIcon = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    "& .icon": {
        fontSize: "44px",
        color: "#bdc0fc"
    },
    "& .icon-overlay": {
        position: "absolute",
        left: "10px",
        fontSize: "44px",
        color: "#b0b4f8"
    }
}));

const ContentBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    "& small": { color: "#81818a" },
    "& .icon": { opacity: 0.6, fontSize: "44px", color: "#959bf7" } // Icon color
}));

const Heading = styled("h6")(({ theme }) => ({
    margin: 0,
    marginTop: "4px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#737cf7" // Text color
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    fontSize: "18px", // Adjust icon size
    color: "#b0b4f8", // Light purple
    padding: "8px", // Ensure button size is appropriate
    "&:hover": {
        backgroundColor: "#c0c6ff", // Light purple hover effect
        color: "#ffffff"
    }
}));

const truncateToTwoDecimals = (num) => {
    return Math.floor(num * 100) / 100;
};

export default function StatCards(data) {
    const cardList = [
        { name: "Total Earnings", amount: truncateToTwoDecimals(data.cards?.total_earnings), Icon: DoubleIcon, link: "/products" },
        { name: "Last Month's Earning", amount: truncateToTwoDecimals(data.cards?.last_month_earning), Icon: AttachMoney, link: "/orders" },
        { name: "Last Month's Sold Products", amount: data.cards?.last_month_sold_products, Icon: ShoppingCart, link: "/orders" }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: "12px", gap: '16px', flexWrap: 'nowrap' }} id="track-earning">
            {cardList.map(({ amount, Icon, name, link }) => (
                <Grid item xs={12} md={4} key={name} style={{padding: 0}}>
                    <StyledCard elevation={4}>
                        <ContentBox>
                            {name === "Total Earnings" ? (
                                <DoubleIcon>
                                    <AttachMoney className="icon-overlay" />
                                    <AttachMoney className="icon" />
                                </DoubleIcon>
                            ) : (
                                <Icon className="icon" />
                            )}

                            <Box ml="12px">
                                <Small>{name}</Small>
                                <Heading>{amount}</Heading>
                            </Box>
                        </ContentBox>

                        <Tooltip title="View Details" placement="top">
                            <StyledIconButton onClick={() => window.location.href = link}>
                                <ArrowForwardIos style={{ fontSize: 18 }} />
                            </StyledIconButton>
                        </Tooltip>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
}
