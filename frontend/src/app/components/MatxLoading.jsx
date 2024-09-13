import {Box, CircularProgress, styled} from "@mui/material";

// STYLED COMPONENT
const StyledLoading = styled("div")({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
        width: "auto",
        height: "40px"
    },
    "& .circleProgress": {
        position: "absolute",
        left: 0,
        right: 0,
        top: "calc(100% - 48px)"
    }
});

export default function Loading() {
    return (
        <StyledLoading>
            <Box position="relative">
                {/*<img src="/assets/images/logo-circle.svg" alt=""/>*/}
                <CircularProgress className="circleProgress"/>
            </Box>
        </StyledLoading>
    );
}
