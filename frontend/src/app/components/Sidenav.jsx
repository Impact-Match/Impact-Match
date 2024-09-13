import React, {Fragment, useContext} from "react";
import {styled} from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";

import {MatxVerticalNav} from "app/components";
import {navigations} from "app/navigations";
import AuthContext from "app/contexts/JWTAuthContext";

// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
    paddingLeft: "1rem",
    paddingRight: "1rem",
    position: "relative"
}));

export default function Sidenav({children}) {
    const {user, isAuthenticated, role} = useContext(AuthContext);
    const userRole = isAuthenticated && user && typeof user.role == 'string'? user.role.toUpperCase() : "CUSTOMER";

    function checkPermission(requiredRoles, userRole) {
        if (!requiredRoles && !userRole) return false;
        return requiredRoles.includes(userRole);
    }

    function filterNavigation(items, userRole) {
        return items.reduce((acc, item) => {
            if (item.children) {
                const filteredChildren = filterNavigation(item.children, userRole);
                if (filteredChildren.length > 0) {
                    acc.push({...item, children: filteredChildren});
                }
            } else if (item.roles && checkPermission(item.roles, userRole)) {
                acc.push(item);
            }
            return acc;
        }, []);
    }

    return (
        <Fragment>
            <StyledScrollBar options={{suppressScrollX: true}} >
                {children}
                <MatxVerticalNav items={filterNavigation(navigations, userRole)}/>
            </StyledScrollBar>

            {/*<SideNavMobile onClick={() => updateSidebarMode({mode: "close"})}/>*/}
        </Fragment>
    );
}
