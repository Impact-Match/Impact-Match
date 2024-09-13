import React, { Fragment, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Box, ButtonBase, Icon, styled } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { Paragraph, Span } from "../Typography";
import MatxVerticalNavExpansionPanel from "./MatxVerticalNavExpansionPanel";

// STYLED COMPONENTS
const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
    fontSize: "12px",
    marginTop: "100px",
    marginLeft: "15px",
    marginBottom: "10px",
    textTransform: "uppercase",
    display: mode === "compact" && "none",
    color: theme.palette.text.secondary
}));

const ExtAndIntCommon = {
    display: "flex",
    overflow: "hidden",
    borderRadius: "8px",
    height: 40,
    whiteSpace: "pre",
    marginBottom: "8px",
    textDecoration: "none",
    justifyContent: "space-between",
    transition: "all 150ms ease-in",
    "&:hover": {
        background: "#959bf7"
    },
    "&.compactNavItem": {
        overflow: "hidden",
        justifyContent: "center !important"
    },
    "& .icon": {
        fontSize: "18px",
        paddingLeft: "16px",
        paddingRight: "8px",
        verticalAlign: "middle"
    }
};
const ExternalLink = styled("a")(({ theme }) => ({
    ...ExtAndIntCommon,
    color: theme.palette.text.primary
}));

const InternalLink = styled(Box)(({ theme }) => ({
    "& a": {
        ...ExtAndIntCommon,
        color: "#000000",
        "&.navItemActive": {
            backgroundColor: "#717cff",
            color: theme.palette.text.primary
        }
    },
}));

const StyledText = styled(Span)(({ mode }) => ({
    fontSize: "0.875rem",
    paddingLeft: "0.8rem",
    display: mode === "compact" && "none"
}));

const BulletIcon = styled("div")(({ theme }) => ({
    padding: "2px",
    marginLeft: "24px",
    marginRight: "8px",
    overflow: "hidden",
    borderRadius: "300px",
    background: theme.palette.text.primary
}));

const BadgeValue = styled("div")(() => ({
    padding: "1px 8px",
    overflow: "hidden",
    borderRadius: "300px"
}));

export default function MatxVerticalNav({ items }) {
    const { settings } = useSettings();
    const { mode } = settings.layout1Settings.leftSidebar;
    const [howItWorksMarginTop, setHowItWorksMarginTop] = useState("0px");

    useEffect(() => {
        const navHeight = document.querySelector('.navigation').clientHeight;
        const totalHeight = window.innerHeight;
        const remainingHeight = totalHeight - navHeight;
        const marginTop = remainingHeight * 0.6;
        setHowItWorksMarginTop(`${marginTop}px`);
    }, []);

    const renderLevels = (data) => {
        return data.map((item, index) => {
            if (item.type === "label")
                return (
                    <ListLabel key={index} mode={mode} className="sidenavHoverShow">
                        {item.label}
                    </ListLabel>
                );

            if (item.children) {
                return (
                    <MatxVerticalNavExpansionPanel mode={mode} item={item} key={index}>
                        {renderLevels(item.children)}
                    </MatxVerticalNavExpansionPanel>
                );
            } else if (item.type === "extLink") {
                return (
                    <ExternalLink
                        key={index}
                        href={item.path}
                        className={`${mode === "compact" && "compactNavItem"}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        id={item.identifier === 'how-it-works' ? 'how-it-works' : undefined}
                        style={item.identifier === 'how-it-works' ? { marginTop: howItWorksMarginTop, fontSize: '0.75rem', fontWeight: 'lighter' } : {}}
                    >
                        <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                            {(() => {
                                if (item.icon) {
                                    return <Icon className="icon">{item.icon}</Icon>;
                                } else {
                                    return <span className="item-icon icon-text">{item.iconText}</span>;
                                }
                            })()}
                            <StyledText mode={mode} className="sidenavHoverShow">
                                {item.name}
                            </StyledText>
                            <Box mx="auto"></Box>
                            {item.badge && <BadgeValue>{item.badge.value}</BadgeValue>}
                        </ButtonBase>
                    </ExternalLink>
                );
            } else {
                return (
                    <InternalLink key={index} sx={item.identifier === 'how-it-works' ? { marginTop: howItWorksMarginTop, fontSize: '0.75rem', fontWeight: 'lighter' } : {}}>
                        <NavLink
                            to={item.path}
                            id={item.identifier === 'how-it-works' ? 'how-it-works' : undefined}
                            className={({ isActive }) =>
                                isActive
                                    ? `navItemActive ${mode === "compact" && "compactNavItem"}`
                                    : `${mode === "compact" && "compactNavItem"}`
                            }>
                            <ButtonBase key={item.name} name="child" sx={{ width: "100%" }}>
                                {item?.icon ? (
                                    <Icon className="icon" sx={{ width: 36 }}>
                                        {item.icon}
                                    </Icon>
                                ) : (
                                    <Fragment>
                                        <BulletIcon
                                            className={`nav-bullet`}
                                            sx={{ display: mode === "compact" && "none" }}
                                        />
                                        <Box
                                            className="nav-bullet-text"
                                            sx={{
                                                ml: "20px",
                                                fontSize: "11px",
                                                display: mode !== "compact" && "none"
                                            }}>
                                            {item.iconText}
                                        </Box>
                                    </Fragment>
                                )}
                                <StyledText mode={mode} className="sidenavHoverShow">
                                    {item.name}
                                </StyledText>

                                <Box mx="auto" />

                                {item.badge && (
                                    <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                                )}
                            </ButtonBase>
                        </NavLink>
                    </InternalLink>
                );
            }
        });
    };

    return <div className="navigation">{renderLevels(items)}</div>;
}