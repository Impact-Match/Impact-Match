import {Box, styled} from "@mui/material";

// STYLED COMPONENTS
const Container = styled("div")({
    backgroundColor: "#ffffff", // White background
    height: "100%",
    padding: "20px 24px",
    boxShadow: "0px 3px 6px rgba(0,0,0,0.1)", // Optional: adding some shadow to mimic card appearance
    borderRadius: "4px", // Optional: rounding the corners
});

const CardTitle = styled("div")(({subtitle}) => ({
    fontSize: "1rem",
    fontWeight: "500",
    textTransform: "capitalize",
    marginBottom: !subtitle && "16px"
}));

export default function SimpleCard({children, title, subtitle}) {
    return (
        <Container>
            <CardTitle subtitle={subtitle}>{title}</CardTitle>
            {subtitle && <Box mb={2}>{subtitle}</Box>}
            {children}
        </Container>
    );
}
