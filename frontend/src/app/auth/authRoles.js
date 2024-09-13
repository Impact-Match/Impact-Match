export const authRoles = {
    sa: ["SA"], // Only Super Admin has access
    admin: ["SA", "ADMIN"], // Only SA & Admin has access
    combine: ["SA", "ADMIN", "INFLUENCER"], // Only SA & ADMIN & Editor has access
    influencer: ["SA", "INFLUENCER"], // Only SA & Editor has access
    customer: ["SA", "INFLUENCER", "CUSTOMER"], // Everyone has access
    all: ["SA", "ADMIN","INFLUENCER", "CUSTOMER"]
};
