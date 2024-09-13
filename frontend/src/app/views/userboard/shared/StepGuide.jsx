import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, styled, Paper } from '@mui/material';

// STYLED COMPONENTS
const Overlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 修改透明度为50%
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const GuideBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: '400px',
    position: 'absolute',
    zIndex: 10000,
}));

const HighlightBoxContainer = styled(Box)(({ top, left, width, height }) => ({
    position: 'absolute',
    top,
    left,
    width,
    height,
    zIndex: 10001,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
}));

const HighlightBox = styled(Box)(({ width, height }) => ({
    width,
    height,
    borderRadius: '12px', // 设置圆角边缘
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 1)', // 100%透明度的边框
}));

const StepGuide = ({ steps, onClose, targets }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const calculatePositions = () => {
            const newPositions = steps.map((step, index) => {
                const target = targets[index].current;
                if (target) {
                    const rect = target.getBoundingClientRect();
                    return {
                        top: rect.top + window.scrollY,
                        left: rect.left + window.scrollX,
                        width: rect.width,
                        height: rect.height,
                    };
                }
                return { top: 0, left: 0, width: 0, height: 0 };
            });
            setPositions(newPositions);
        };

        calculatePositions();
        window.addEventListener('resize', calculatePositions);
        return () => window.removeEventListener('resize', calculatePositions);
    }, [steps, targets]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    return (
        <Overlay>
            {positions.length > 0 && (
                <>
                    <GuideBox style={{ top: positions[currentStep].top + 20, left: positions[currentStep].left }}>
                        <Typography variant="h6">{steps[currentStep].title}</Typography>
                        <Typography variant="body1">{steps[currentStep].description}</Typography>
                        <Box mt={2}>
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
                            </Button>
                        </Box>
                    </GuideBox>
                    <HighlightBoxContainer
                        top={positions[currentStep].top}
                        left={positions[currentStep].left}
                        width={positions[currentStep].width}
                        height={positions[currentStep].height}
                    >
                        <HighlightBox
                            width={positions[currentStep].width}
                            height={positions[currentStep].height}
                        />
                    </HighlightBoxContainer>
                </>
            )}
        </Overlay>
    );
};

export default StepGuide;