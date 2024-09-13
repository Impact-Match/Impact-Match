import {Box, styled} from "@mui/material";
import {MatxLogo} from "app/components";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 18px 20px 29px"
}));

export default function Brand({children}) {

    return (
        <BrandRoot>
            <Box display="flex" alignItems="center">
                <MatxLogo/>
            </Box>
        </BrandRoot>
    );
}
