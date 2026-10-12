// DEMO accounts (frontend only). Passwords are stored as hashes, never as plain text.
// Demo logins are documented in README: customer@gadzetro.demo and admin@gadzetro.demo.
export const mockUsers = [
  { id: 'u-customer', name: 'Demo Customer', email: 'customer@gadzetro.demo', phone: '9876543210', role: 'customer', createdAt: '2026-08-01T09:00:00.000Z', passwordHash: '51cf94a7821701cce5a0d7a066706d5d9c2c648348ca83df038d0403610886d0' },
  { id: 'u-admin', name: 'Demo Admin', email: 'admin@gadzetro.demo', phone: '9123456780', role: 'admin', createdAt: '2026-08-01T09:00:00.000Z', passwordHash: '304ccde5147353f8d372fb6cbcabb5015906a16bf1aaca1ea71ff40efc4cc407' },
]
