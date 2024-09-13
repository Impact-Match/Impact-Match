import React, { Fragment, useEffect, useState } from "react";
import { Box, Card, Grid, styled, useTheme } from "@mui/material";
import axios from 'axios';
import useAuth from "app/hooks/useAuth";
import StatCards from "./shared/StatCards";
import DoughnutChart from "./shared/Doughnut";
import UpgradeCard from "./shared/UpgradeCard";
import TopSellingProducts from "./shared/TopSellingProducts";
import GuideOverlay from "./GuideOverlay";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" }
}));

const Title = styled("span")(() => ({
    fontSize: "1rem",
    fontWeight: "500",
    marginRight: ".5rem",
    textTransform: "capitalize"
}));

const SubTitle = styled("span")(({ theme }) => ({
    fontSize: "0.875rem",
    color: theme.palette.text.secondary
}));

const calculateInitialRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    let startMonth;
    if (day >= 15) {
        startMonth = new Date(year, month - 1, 1);
    } else {
        startMonth = new Date(year, month - 2, 1);
    }

    return [0, 1, 2].map((monthsAgo) => {
        const date = new Date(startMonth.getFullYear(), startMonth.getMonth() - monthsAgo, 1);
        const valueMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return valueMonth;
    });
};

export default function Analytics() {
    const { palette } = useTheme();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [range, setRange] = useState([]);
    const [openGuide, setOpenGuide] = useState(false);

    const fetchDashboardData = async (selectedRange, selectedMonth) => {
        try {
            const response = await axios.post(`${BASE_URL}/userdash`, {
                influencer_name: user.influencer_name,
                role: user.role,
                range: selectedRange,
                month: selectedMonth // Add month field
            });
            if (response.status === 200) {
                setData(response.data);
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const initialRange = calculateInitialRange();
        setRange(initialRange);
        fetchDashboardData(initialRange, initialRange[0]);
    }, [BASE_URL, user]);

    return (
        <Fragment>
            <ContentBox className="analytics">
                <Grid container spacing={2}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Box id="stat-cards-step" pt={2} pl={2}>
                            <StatCards cards={data?.cards} />
                        </Box>
                        <Box id="top-selling-products-step">
                            <TopSellingProducts productsData={data?.top_products} range={range} />
                        </Box>
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Card sx={{ px: 3, py: 2, mb: 2 }}>
                            <Title>Traffic Sources</Title>
                            <SubTitle>Last 30 days</SubTitle>

                            <DoughnutChart
                                height="300px"
                                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
                            />
                        </Card>
                        <Box id="upgrade-card-step">
                            <UpgradeCard />
                        </Box>
                    </Grid>
                </Grid>
            </ContentBox>
            <GuideOverlay open={openGuide} handleClose={() => setOpenGuide(false)} />
        </Fragment>
    );
}