import {Box, Button, styled, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import React from "react";

// STYLED COMPONENTS
const FlexBox = styled(Box)({
    display: "flex",
    alignItems: "center"
});

const JustifyBox = styled(FlexBox)({
    maxWidth: 320,
    flexDirection: "column",
    justifyContent: "center"
});

const IMG = styled("img")({
    width: "100%",
    marginBottom: "32px"
});

const NotFoundRoot = styled(FlexBox)({
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh !important"
});

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <NotFoundRoot>
            <JustifyBox>
                <IMG src="/assets/images/illustrations/404.svg" alt=""/>

                <Button
                    color="primary"
                    variant="contained"
                    sx={{textTransform: "capitalize"}}
                    onClick={() => navigate(-1)}>
                    Go Back
                </Button>
                <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                    *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                </Typography>
            </JustifyBox>
        </NotFoundRoot>
    );
}
