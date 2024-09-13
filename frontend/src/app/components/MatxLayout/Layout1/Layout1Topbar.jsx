import { memo } from "react";
import { Link } from "react-router-dom";
import { Box, Hidden, IconButton, MenuItem, styled, useMediaQuery, useTheme } from "@mui/material";

import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";

import { Span } from "app/components/Typography";
import { MatxMenu } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";

import { topBarHeight } from "app/utils/constant";

import { Home, Menu, Person, PowerSettingsNew } from "@mui/icons-material";
import ProfilePhoto from '../../../components/ProfilePhoto';

// STYLED COMPONENTS
const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
    top: 0,
    zIndex: 96,
    height: topBarHeight,
    boxShadow: themeShadows[8],
    transition: "all 0.3s ease"
});

const TopbarContainer = styled(Box)(({ theme }) => ({
    padding: "8px",
    paddingLeft: 18,
    paddingRight: 20,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
    [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled(Box)({
    padding: 4,
    display: "flex",
    borderRadius: 24,
    cursor: "pointer",
    alignItems: "center",
    "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    minWidth: 185,
    "& a": {
        width: "100%",
        display: "flex",
        alignItems: "center",
        textDecoration: "none"
    },
    "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

const Layout1Topbar = ({ onToggleSidenav }) => {
    const theme = useTheme();
    const { settings, updateSettings } = useSettings();
    const { logout, user } = useAuth();
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
    };

    const handleSidebarToggle = () => {
        let { layout1Settings } = settings;
        let mode;
        if (isMdScreen) {
            mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
        } else {
            mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
        }
        updateSidebarMode({ mode });
        onToggleSidenav();
    };

    return (
        <TopbarRoot>
            <TopbarContainer>
                <Box display="flex">
                    <StyledIconButton onClick={handleSidebarToggle}>
                        <Menu />
                    </StyledIconButton>
                </Box>

                <Box display="flex" alignItems="center">
                    <MatxMenu
                        menuButton={
                            <UserMenu>
                                <Hidden xsDown>
                                    <Span>
                                        Hi <strong>{user.influencer_name}</strong>
                                    </Span>
                                </Hidden>
                                <ProfilePhoto style={{ width: 35, height: 35, borderRadius: '50%' }} sx={{ cursor: "pointer" }} />
                            </UserMenu>
                        }>
                        <StyledItem>
                            <Link to="/">
                                <Home />
                                <Span>Home</Span>
                            </Link>
                        </StyledItem>

                        <StyledItem>
                            <Link to="/resume">
                                <Person />
                                <Span>Profile</Span>
                            </Link>
                        </StyledItem>

                        {/*<StyledItem>*/}
                        {/*    <Settings/>*/}
                        {/*    <Span>Settings</Span>*/}
                        {/*</StyledItem>*/}

                        <StyledItem onClick={logout}>
                            <PowerSettingsNew />
                            <Span>Logout</Span>
                        </StyledItem>
                    </MatxMenu>
                </Box>
            </TopbarContainer>
        </TopbarRoot>
    );
};

export default memo(Layout1Topbar);