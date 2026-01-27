export const getSubdomain = (): string | null => {
    const hostname = window.location.hostname;

    // Check for localhost or IP - treat as main domain (no subdomain)
    if (hostname.includes('localhost') || hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        return null;
    }

    const parts = hostname.split('.');

    // Handle hermeosproptech.com (2 parts) vs admin.hermeosproptech.com (3 parts)
    if (parts.length >= 3) {
        return parts[0];
    }

    return null;
};

export const isAdminDomain = (): boolean => {
    const sub = getSubdomain();
    return sub === 'admin';
};
