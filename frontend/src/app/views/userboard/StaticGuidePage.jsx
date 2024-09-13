import React, { useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const staticSteps = [
    {
        title: "Step 1: Get Your Promo Code",
        description: ["Sign up to find and copy your promo code on the dashboard."],
        img: "../assets/images/step1.png"
    },
    {
        title: "Step 2: Share Your Promo Code",
        description: ["Share on platforms like TikTok, Instagram, and YouTube."],
        img: "../assets/images/step2.png"
    },
    {
        title: "Step 3: Track Your Earnings",
        description: ["Monitor purchases and earnings in real-time on your dashboard."],
        img: "../assets/images/step3.png"
    },
    {
        title: "Step 4: Get Paid",
        description: ["Receive monthly commissions on the 15th for sales from the previous month."],
        img: "../assets/images/step4.png"
    }
];

const additionalBenefits = [
    {
        title: "Discounts for Your Followers",
        content: [
            {
                subtitle: "",
                text: "Anyone using your Promo Code will get a 10% discount on their purchase, making it more enticing for them to buy through your link.",
            },
        ],
        img: "../assets/images/discount.png",
    },
    {
        title: "Support",
        content: [
            {
                subtitle: "",
                text: "Our dedicated team is here to help you optimize your promotional strategies and increase your earnings.",
            },
        ],
        img: "../assets/images/support.png",
    },
    {
        title: "Track and Optimize",
        content: [
            {
                subtitle: "",
                text: "Use the insights from your dashboard to understand what works and refine your strategies for even better results.",
            },
        ],
        img: "../assets/images/track.png",
    },
];

const highlightTitle = (title) => {
    const colonIndex = title.indexOf(":");
    if (colonIndex !== -1) {
        return (
            <>
                <span style={{ color: "#6D7CFF" }}>{title.substring(0, colonIndex + 1)}</span>
                {title.substring(colonIndex + 1)}
            </>
        );
    }
    return title;
};

const StaticGuidePage = ({ handleNext }) => {
    const [openStatic, setOpenStatic] = useState(true);
    const [openBenefits, setOpenBenefits] = useState(false);

    const handleOpenBenefits = () => {
        setOpenStatic(false);
        setOpenBenefits(true);
    };
    const handleCloseBenefits = () => setOpenBenefits(false);

    return (
        <>
            <Modal
                open={openStatic}
                onClose={() => setOpenStatic(false)}
                closeAfterTransition
                BackdropProps={{
                    timeout: 500,
                    style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                }}
            >
                <Fade in={openStatic}>
                    <Box
                        sx={{
                            textAlign: "center",
                            backgroundColor: "#fff",
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 5,
                            maxWidth: { xs: "90%", sm: "80%" },
                            maxHeight: "90vh",
                            overflowY: "auto",
                            zIndex: 1001,
                            margin: "auto",
                            marginTop: 4,
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "black",
                                marginBottom: 2,
                                fontSize: "22px"
                            }}
                        >
                            How to Use Influencer Tracker
                        </Typography>
                        <Typography
                            sx={{
                                color: "#6B6B6B",
                                marginBottom: 4,
                                fontWeight: "normal",
                                fontSize: "16px"
                            }}
                        >
                            The more you promote, the more you earn. It’s that simple!
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: 1,
                                paddingBottom: 1
                            }}
                        >
                            {staticSteps.map((step, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        backgroundColor: "#F7F7F7",
                                        borderRadius: "10px",
                                        padding: 2,
                                        margin: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "left"
                                    }}
                                >
                                    <Box sx={{ flex: 7 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "black",
                                                fontSize: "18px"
                                            }}
                                        >
                                            {highlightTitle(step.title)}
                                        </Typography>
                                        {step.description.map((desc, subIndex) => (
                                            <Typography
                                                key={subIndex}
                                                variant="body2"
                                                sx={{
                                                    fontSize: "16px",
                                                    color: "black",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginY: 1
                                                }}
                                            >
                                                {desc}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <Box sx={{ flex: 3, display: "flex", justifyContent: "center" }}>
                                        <img src={step.img} alt={step.title} style={{ width: "100%", borderRadius: "10px" }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                                mb: 2,
                                pr: 2
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: "20px" }}
                                onClick={handleOpenBenefits}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={openBenefits}
                onClose={handleCloseBenefits}
                closeAfterTransition
                BackdropProps={{
                    timeout: 500,
                    style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                }}
            >
                <Fade in={openBenefits}>
                    <Box
                        sx={{
                            textAlign: "center",
                            backgroundColor: "#fff",
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 5,
                            maxWidth: { xs: "90%", sm: "80%" },
                            maxHeight: "90vh",
                            overflowY: "auto",
                            zIndex: 1001,
                            margin: "auto",
                            marginTop: 4,
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    color: "black",
                                    marginBottom: 2,
                                    fontSize: "22px"
                                }}
                            >
                                Additional Benefits
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#6B6B6B",
                                    marginBottom: 4,
                                    fontWeight: "normal",
                                    fontSize: "16px"
                                }}
                            >
                                The more you promote, the more you earn. It’s that simple!
                            </Typography>
                            <Grid container spacing={2}>
                                {additionalBenefits.map((benefit, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Box
                                            sx={{
                                                backgroundColor: "#F7F7F7",
                                                borderRadius: "10px",
                                                padding: 2,
                                                margin: 1,
                                                textAlign: "left",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Box sx={{ flex: 8, textAlign: "left" }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: "black",
                                                        fontSize: "18px",
                                                        marginBottom: 1
                                                    }}
                                                >
                                                    {highlightTitle(benefit.title)}
                                                </Typography>
                                                {benefit.content.map((item, subIndex) => (
                                                    <Box key={subIndex} sx={{ marginBottom: 1 }}>
                                                        <Typography
                                                            component="span"
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: "#6D7CFF",
                                                                fontSize: "16px"
                                                            }}
                                                        >
                                                            {item.subtitle}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: "16px",
                                                                color: "#6B6B6B"
                                                            }}
                                                        >
                                                            {item.text}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                            <Box sx={{ flex: 1.5, display: "flex", justifyContent: "center" }}>
                                                <img src={benefit.img} alt={benefit.title} style={{ width: "70%", borderRadius: "10px" }} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                                mb: 2,
                                pr: 2
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: "20px" }}
                                onClick={handleNext}
                            >
                                Done
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default StaticGuidePage;