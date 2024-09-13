import React from "react";
import { styled } from "@mui/material";

// STYLED COMPONENTS
const StyledRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    [theme.breakpoints.down('md')]: {
        flexDirection: "column",
        overflowY: "auto",
    },
    "& .left-half": {
        backgroundColor: "#dadcfc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: "100vh",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            height: "80%",
            paddingBottom: theme.spacing(4),
        },
    },
    "& .right-half": {
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(4),
        width: "50%",
        height: "100vh",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            height: "auto",
            padding: theme.spacing(8),
        },
    },
    ".img-wrapper": {
        width: "85%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(0),
        },
        "& img": {
            maxWidth: "80%",
            height: "auto",
            maxHeight: "100%",
        },
    },
    ".logo-wrapper": {
        position: "absolute",
        top: 20,
        left: 20,
        padding: "1rem",
    },
}));

export default StyledRoot;
