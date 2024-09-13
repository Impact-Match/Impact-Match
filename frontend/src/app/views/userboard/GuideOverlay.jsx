import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Fade, Slide, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import HelpIcon from "@mui/icons-material/Help";
import StaticGuidePage from "./StaticGuidePage";
import "./GuideOverlay.css";

const Overlay = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}));

const HighlightBox = styled(Box)(({ top, left, width, height }) => ({
    position: "absolute",
    top: top,
    left: left,
    width: width,
    height: height,
    backgroundColor: "transparent",
    border: "2px solid #959bf7",
    borderRadius: "10px",
    zIndex: 1001,
    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)" // 创建灰色半透明背景
}));

const GuideBox = styled(Box)(({ theme, top, left, position, transform }) => ({
    position: position || "absolute",
    top: top,
    left: left,
    transform: transform,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    zIndex: 1002,
    borderRadius: "10px",
    maxWidth: "400px",
    transition: "all 1s ease-out",
    animation: "fadeIn 1s, bounceIn 1s", // 添加动画效果并延长时长
    "@keyframes fadeIn": {
        "0%": {
            opacity: 0
        },
        "100%": {
            opacity: 1
        }
    },
    "@keyframes bounceIn": {
        "0%, 20%, 40%, 60%, 80%, 100%": {
            transform: "translateY(0)"
        },
        "40%": {
            transform: "translateY(-30px)"
        },
        "60%": {
            transform: "translateY(-15px)"
        }
    }
}));

const FloatingIcon = styled(IconButton)(({ theme }) => ({
    position: "fixed",
    top: "50%",
    right: 0,
    transform: "translate(50%, -50%)",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    zIndex: 1100,
    transition: "transform 0.3s",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
        transform: "translate(0, -50%)"
    }
}));

const steps = [
    {
        title: "Save Your Promo Code",
        description: ["Easily copy and save your Promo Code from Profile section for future use."],
        targetId: "#promo-code",
        position: "left",
        offsetY: -140,
        id: "promocode-step-overlay",
        class: "guide-overlay",
        stepIndicator: "Step 1/4"
    },
    {
        title: "Spread the Word",
        description: [
            "Share your Promo Code on social media platforms like TikTok, Instagram, YouTube, X, and more. The more you share, the greater your potential earnings.",
            "*Content Tips: Create engaging content related to our products to increase the chances of your audience using your Promo Code."
        ],
        targetId: "#social-media",
        position: "left",
        offsetY: -220,
        id: "spreadword-step-overlay",
        class: "guide-overlay",
        stepIndicator: "Step 2/4"
    },
    {
        title: "Track Your Earnings",
        description: [
            "Real-Time Tracking: Our system automatically tracks every purchase made using your Promo Code.",
            "Earnings Dashboard: Check your dashboard for real-time updates on your earnings and see how much you’ve made."
        ],
        targetId: "#track-earning",
        position: "bottom",
        offsetY: 30,
        id: "trackearnings-step-overlay",
        class: "guide-overlay",
        stepIndicator: "Step 3/4"
    },
    {
        title: "Get Paid Every Month",
        description: ["Earn commissions on the 15th of each month based on the sales generated through your Promo Code."],
        targetId: "#commission-row",
        position: "right",
        offsetY: -10,
        id: "getpaid-step-overlay",
        class: "guide-overlay",
        stepIndicator: "Step 4/4"
    },
    {
        title: "Explore More Details!",
        description: ["Click below for instant access to our user guidance page at any time."],
        targetId: "#how-it-works",
        position: "right",
        offsetY: -120,
        id: "exploremore-step-overlay",
        class: "guide-overlay"
    }
];

const GuideOverlay = ({ open, handleClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightStyle, setHighlightStyle] = useState({});
    const [guideBoxStyle, setGuideBoxStyle] = useState({});
    const [showGuide, setShowGuide] = useState(false);
    const [showStaticGuide, setShowStaticGuide] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCloseGuide();
        }
    };

    const handleOpenGuide = () => {
        setShowStaticGuide(true);
    };

    const handleCloseGuide = () => {
        setShowGuide(false);
        setShowStaticGuide(false);
        handleClose();
    };

    const handleStaticGuideNext = () => {
        setShowStaticGuide(false);
        setShowGuide(true);
    };

    const updateGuideStyles = () => {
        if (showGuide) {
            const targetElement = steps[currentStep].targetId ? document.querySelector(steps[currentStep].targetId) : null;

            if (targetElement) {
                // const rect = targetElement.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                windowWidth < 900 && targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

                // window.scrollTo({
                //     top: rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2,
                //     behavior: "smooth"
                // });

                setTimeout(() => {
                    const newRect = targetElement.getBoundingClientRect();
                    setHighlightStyle({
                        top: newRect.top + window.scrollY - 10,
                        left: newRect.left + window.scrollX - 10,
                        width: newRect.width + 20,
                        height: newRect.height + 20
                    });

                    // if the step is commission one
                    if (steps[currentStep].targetId.includes("commission")) {
                        const tableElement = document.getElementById("top-sell-product-table");
                        setHighlightStyle({
                            top: newRect.top + window.scrollY - 10,
                            left: newRect.left + window.scrollX - 10,
                            width: newRect.width + 20,
                            height: tableElement.offsetHeight + 20
                        });
                    }

                    let guideBoxTop, guideBoxLeft;
                    const offsetY = steps[currentStep].offsetY || 0; // 使用 offsetY 参数
                    switch (steps[currentStep].position) {
                        case "left":
                            guideBoxTop = newRect.top + window.scrollY + offsetY;
                            guideBoxLeft = newRect.left + window.scrollX - 430;
                            break;
                        case "right":
                            guideBoxTop = newRect.top + window.scrollY + offsetY;
                            guideBoxLeft = newRect.left + window.scrollX + newRect.width + 30;
                            break;
                        case "top":
                            guideBoxTop = newRect.top + window.scrollY + offsetY;
                            guideBoxLeft = newRect.left + window.scrollX;
                            break;
                        case "bottom":
                            guideBoxTop = newRect.top + window.scrollY + newRect.height + offsetY;
                            guideBoxLeft = newRect.left + window.scrollX;
                            break;
                        default:
                            guideBoxTop = "50%";
                            guideBoxLeft = "50%";
                            break;
                    }

                    setGuideBoxStyle({
                        top: guideBoxTop,
                        left: guideBoxLeft,
                        transform: steps[currentStep].position ? "none" : "translate(-50%, -50%) !important"
                    });
                }, 500);
            } else {
                setHighlightStyle({});
                setGuideBoxStyle({
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) !important"
                });
            }
        }
    };

    useEffect(() => {
        updateGuideStyles();
    }, [showGuide, currentStep]);

    useEffect(() => {
        const handleResize = () => {
            updateGuideStyles();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [currentStep]);

    return (
        <>
            <FloatingIcon onClick={handleOpenGuide}>
                <HelpIcon />
            </FloatingIcon>
            <Modal
                open={showStaticGuide}
                onClose={handleCloseGuide}
                closeAfterTransition
                BackdropProps={{
                    timeout: 500,
                    style: { backgroundColor: "transparent" }
                }}
            >
                <Fade in={showStaticGuide}>
                    <Box>
                        <StaticGuidePage handleNext={handleStaticGuideNext} /> {/* 传递 handleNext */}
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={showGuide}
                onClose={handleCloseGuide}
                closeAfterTransition
                BackdropProps={{
                    timeout: 500,
                    style: { backgroundColor: "transparent" }
                }}
                className="guide-container"
            >
                <Fade in={showGuide}>
                    <Box>
                        <Overlay />
                        {steps[currentStep].targetId && <HighlightBox {...highlightStyle} />}
                        <Slide direction="right" in={showGuide} mountOnEnter unmountOnExit>
                            <GuideBox sx={{ ...guideBoxStyle }} id={steps[currentStep].id} className={steps[currentStep].class}>
                                <Typography variant="h6" gutterBottom>
                                    {steps[currentStep].title}
                                </Typography>
                                {steps[currentStep].description.map((desc, idx) => (
                                    <Typography key={idx} variant="body1" gutterBottom>
                                        {desc}
                                    </Typography>
                                ))}
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    {steps[currentStep].stepIndicator ? (
                                        <Typography variant="body2" color="textSecondary">
                                            {steps[currentStep].stepIndicator}
                                        </Typography>
                                    ) : (
                                        <Box />
                                    )}
                                    <Button onClick={handleNext} variant="contained" sx={{ borderRadius: "20px" }} color="primary">
                                        {currentStep < steps.length - 1 ? "Next" : "Got it!"}
                                    </Button>
                                </Box>
                            </GuideBox>
                        </Slide>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default GuideOverlay;
