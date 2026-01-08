// Unit tests for CapabilityService and Authorization Logic
// Note: These are logic tests and do not connect to a real DB in this environment.

import { CapabilityService } from '../services/capability.service';
import { CAPABILITIES } from '../config/capabilities';

describe('Capability Registry', () => {
    test('Registry should have no duplicate capability names', () => {
        const names = new Set<string>();
        Object.values(CAPABILITIES).forEach(cap => {
            if (names.has(cap.name)) {
                throw new Error(`Duplicate capability name: ${cap.name}`);
            }
            names.add(cap.name);
        });
        expect(names.size).toBe(Object.keys(CAPABILITIES).length);
    });

    test('Registry entries should have valid types', () => {
        Object.values(CAPABILITIES).forEach(cap => {
            expect(['USER_FACING', 'ADMIN_ONLY', 'SYSTEM']).toContain(cap.type);
        });
    });
});

describe('Legacy Compatibility Logic', () => {
    test('Admin role should map to specific capabilities', () => {
        const adminCaps = [
            CAPABILITIES.VIEW_ADMIN_DASHBOARD.name,
            CAPABILITIES.MANAGE_USERS.name,
            CAPABILITIES.APPROVE_KYC.name
        ];

        // This is a static check of the registry definition to ensure documentation matches intent
        expect(CAPABILITIES.MANAGE_USERS.legacyRoleMapping).toContain('ADMIN');
    });
});
