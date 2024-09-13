import { authRoles } from './auth/authRoles';

export const navigations = [
    { name: "Userboard", path: "/userboard/default", icon: "home", roles: authRoles.customer },
    { name: "Influencers", path: "/influencers", icon: "people", roles: authRoles.admin },
    // insights auto_graph bar_chart equalizer
    { label: "PAGES", type: "label" },
    {
        name: "Analytics",
        icon: "equalizer",
        roles: authRoles.admin,
        children: [
            { name: "Overview", path: "/charts/overview", roles: authRoles.admin },
            { name: "Influencers", path: "/charts/influencers", roles: authRoles.admin },
        ]
    },
    // Add the new menu item
    {
        name: "How it works",
        path: "/how-it-works",
        icon: "help_outline",
        roles: authRoles.influencer,
        identifier: 'how-it-works'
    }
];
