export const getSubdomain = (): string | null => {
    const hostname = window.location.hostname;

    // Check for localhost or IP
    if (hostname.includes('localhost') || hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        return null; // Treat localhost as main domain for now, unless specific mapped
    }

    const parts = hostname.split('.');

    // Handle hermeosproptech.com (2 parts) vs admin.hermeosproptech.com (3 parts)
    // Also handles double TLDs like .co.uk if necessary, but assuming .com for now based on user input
    if (parts.length >= 3) {
        return parts[0];
    }

    return null;
};

export const isAdminDomain = (): boolean => {
    const sub = getSubdomain();
    return sub === 'admin';
};
