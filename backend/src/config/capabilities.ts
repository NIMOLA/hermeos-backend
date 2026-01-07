// Canonical Capability Registry
// This file is the single source of truth for all system capabilities.
// Do not modify these values without a migration strategy.

export enum CapabilityType {
    USER_FACING = 'USER_FACING',
    ADMIN_ONLY = 'ADMIN_ONLY',
    SYSTEM = 'SYSTEM'
}

export interface CapabilityDefinition {
    name: string;
    description: string;
    type: CapabilityType;
    defaultOnSignup: boolean;
    isDeprecated?: boolean;
    legacyRoleMapping?: string[]; // Documentation only
}

export const CAPABILITIES = {
    // User Facing - Tier 1 (Default)
    BROWSE_MARKETPLACE: {
        name: 'browse_marketplace',
        description: 'View available properties',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: true
    },
    VIEW_PRICING: {
        name: 'view_pricing',
        description: 'See asset pricing details',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: true
    },
    BOOKMARK_ASSETS: {
        name: 'bookmark_assets',
        description: 'Save properties to wishlist',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: true
    },
    INITIATE_INVESTMENT: {
        name: 'initiate_investment',
        description: 'Start investment process',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: true
    },

    // User Facing - Tier 2 (Verified)
    EXECUTE_INVESTMENT: {
        name: 'execute_investment',
        description: 'Finalize and pay for investments',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: false
    },
    ACCESS_REPORTS: {
        name: 'access_reports',
        description: 'View detailed financial reports',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: false
    },
    TRANSFER_ASSETS: {
        name: 'transfer_assets',
        description: 'Transfer ownership to others',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: false
    },
    WITHDRAW_FUNDS: {
        name: 'withdraw_funds',
        description: 'Withdraw form wallet',
        type: CapabilityType.USER_FACING,
        defaultOnSignup: false
    },

    // Admin Capabilities
    VIEW_ADMIN_DASHBOARD: {
        name: 'view_admin_dashboard',
        description: 'Access the admin dashboard',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUPPORT']
    },
    MANAGE_USERS: {
        name: 'manage_users',
        description: 'Create, update, and manage users',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT']
    },
    APPROVE_KYC: {
        name: 'approve_kyc',
        description: 'Review and approve KYC submissions',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN']
    },
    MANAGE_PROPERTIES: {
        name: 'manage_properties',
        description: 'Create and update property listings',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN', 'MODERATOR']
    },
    MANAGE_TRANSACTIONS: {
        name: 'manage_transactions',
        description: 'View and manage system transactions',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN']
    },
    VIEW_AUDIT_LOGS: {
        name: 'view_audit_logs',
        description: 'Access system audit logs',
        type: CapabilityType.ADMIN_ONLY,
        defaultOnSignup: false,
        legacyRoleMapping: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT']
    },

    // Future/Reserved
    // SYSTEM_MAINTENANCE: { ... }
} as const;

export type CapabilityName = typeof CAPABILITIES[keyof typeof CAPABILITIES]['name'];

// Helper to get all capability definitions
export const getAllCapabilities = () => Object.values(CAPABILITIES);

// Helper to get capabilities by type
export const getCapabilitiesByType = (type: CapabilityType) =>
    getAllCapabilities().filter(c => c.type === type);
