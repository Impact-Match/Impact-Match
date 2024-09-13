import {lazy} from "react";
import {Navigate} from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import {authRoles} from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
const UserLogin = Loadable(lazy(() => import("app/views/sessions/UserLogin01")));
const JwtRegister = Loadable(lazy(() => import("app/views/sessions/UserRegister")));
const ForgotPassword = Loadable(lazy(() => import("app/views/sessions/ForgotPassword01")));
const ResetPassword = Loadable(lazy(() => import("app/views/sessions/ResetPassword01")));
const EmailVerification = Loadable(lazy(() => import("app/views/sessions/EmailVerification01")));
const Resume = Loadable(lazy(() => import("app/views/resume/UserProfile")));
const Profile = Loadable(lazy(() => import("app/views/resume/ProfileEdit")));
const Expired = Loadable(lazy(() => import("app/views/sessions/LinkExpired01")));
const VExpired = Loadable(lazy(() => import("app/views/sessions/VerificationExpired")));
// DASHBOARD PAGE

const UserAnalytics = Loadable(lazy(() => import("app/views/userboard/Analytics")));

const routes = [
    {
        element: (
            <AuthGuard>
                <MatxLayout/>
            </AuthGuard>
        ),
        children: [
            {path: "/userboard/default", element: <UserAnalytics/>, auth: authRoles.customer},
            {path: "/profile", element: <Profile/>, auth: authRoles.customer},
            {path: "/resume", element: <Resume/>, auth: authRoles.customer},
        ]
    },

    // session pages route
    {path: "/404", element: <NotFound/>},
    {path: "/login", element: <UserLogin/>},
    {path: "/signup", element: <JwtRegister/>},
    {path: "/resume", element: <Resume/>},
    {path: "/token-expired", element: <Expired/>},
    {path: "/verify-expired", element: <VExpired/>},
    {path: "/session/forgot-password", element: <ForgotPassword/>},
    {path: "/session/reset-password/:token", element: <ResetPassword/>},
    {path: "/session/confirm/:token", element: <EmailVerification/>},
    {path: "/", element: <Navigate to="/login"/>},
    {path: "*", element: <NotFound/>}
];

export default routes;
