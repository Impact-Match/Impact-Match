import { memo, useEffect, useRef } from "react";
import { Box, styled, ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import Scrollbar from "react-perfect-scrollbar";
import { Outlet } from "react-router-dom";

import useSettings from "app/hooks/useSettings";

import Layout1Topbar from "./Layout1Topbar";
import Layout1Sidenav from "./Layout1Sidenav";
import { MatxSuspense } from "app/components";
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";

import { sidenavCompactWidth, sideNavWidth } from "app/utils/constant";

// STYLED COMPONENTS
const Layout1Root = styled(Box)(({ theme }) => ({
    display: "flex",
    background: theme.palette.background.default // page background
}));

const ContentBox = styled(Box)(() => ({
    height: "100%",
    display: "flex",
    overflowY: "auto",
    overflowX: "hidden",
    flexDirection: "column",
    justifyContent: "space-between"
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
    height: "100%",
    position: "relative",
    display: "flex",
    flexGrow: "1",
    flexDirection: "column"
}));

const LayoutContainer = styled(Box)(({ width, open }) => ({
    height: "100vh",
    display: "flex",
    flexGrow: "1",
    flexDirection: "column",
    verticalAlign: "top",
    marginLeft: width,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    marginRight: open ? 50 : 0
}));

const Layout1 = () => {
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const topbarTheme = settings.themes[layout1Settings.topbar.theme];
    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;

    const getSidenavWidth = () => {
        switch (sidenavMode) {
            case "full":
                return sideNavWidth;

            case "compact":
                return sidenavCompactWidth;

            default:
                return "0px";
        }
    };

    const sidenavWidth = getSidenavWidth();
    const theme = useTheme();
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

    const ref = useRef({ isMdScreen, settings });
    const layoutClasses = `theme-${theme.palette.type}`;

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    const handleSidenavToggle = () => {
        const mode = sidenavMode === "full" ? "close" : "full";
        updateSettings({ layout1Settings: { leftSidebar: { ...layout1Settings.leftSidebar, mode } } });
    };

    return (
        <Layout1Root className={layoutClasses}>
            {showSidenav && sidenavMode !== "close" && (
                <SidenavTheme>
                    <Layout1Sidenav onToggle={handleSidenavToggle} />
                </SidenavTheme>
            )}

            <LayoutContainer width={sidenavWidth}>
                {layout1Settings.topbar.show && layout1Settings.topbar.fixed && (
                    <ThemeProvider theme={topbarTheme}>
                        <Layout1Topbar fixed={true} className="elevation-z8" onToggleSidenav={handleSidenavToggle} />
                    </ThemeProvider>
                )}

                {settings.perfectScrollbar ? (
                    <StyledScrollBar>
                        {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
                            <ThemeProvider theme={topbarTheme}>
                                <Layout1Topbar onToggleSidenav={handleSidenavToggle} />
                            </ThemeProvider>
                        )}
                        <Box flexGrow={1} position="relative">
                            <MatxSuspense>
                                <Outlet />
                            </MatxSuspense>
                        </Box>
                    </StyledScrollBar>
                ) : (
                    <ContentBox>
                        {layout1Settings.topbar.show && !layout1Settings.topbar.fixed && (
                            <ThemeProvider theme={topbarTheme}>
                                <Layout1Topbar onToggleSidenav={handleSidenavToggle} />
                            </ThemeProvider>
                        )}

                        <Box flexGrow={1} position="relative">
                            <MatxSuspense>
                                <Outlet />
                            </MatxSuspense>
                        </Box>
                    </ContentBox>
                )}
            </LayoutContainer>
        </Layout1Root>
    );
};

export default memo(Layout1);