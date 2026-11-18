# Basic account authentication

- Explicit registration: full name (2–80 characters), case-insensitive email (up to 254), password (8–128). Database uniqueness prevents concurrent duplicate registrations. Registration signs the user in.
- Login only verifies existing credentials; it never creates users. Existing password accounts remain usable. Shared/passwordless demo login is permanently disabled and existing passwordless user sessions revoked by migration 0011. Account data is not deleted.
- Passwords use scrypt with independent random salts. Sessions use random 256-bit opaque tokens, SHA-256 hashes in PostgreSQL, HttpOnly/SameSite=Lax cookies and Secure on HTTPS. Logout revokes the server session. Successful authentication rotates the browser's previous session.
- Auth endpoints validate JSON, types and same-host browser Origin. PostgreSQL counters enforce 10 login or 5 registration attempts per normalized email per 15 minutes across workers. This is basic per-email throttling, not a substitute for proxy-wide anti-abuse protection. Expired counter rows are reused; maintenance can prune old rows.
- No email verification, password recovery, OAuth or MFA is included. Email ownership is not verified. The external website HTTP basic-auth gate remains separate.
- Tests: 143 passed / 7 optional database tests skipped in the full regression; four dedicated account tests cover API registration/login/logout, duplicate races, invalid input, cross-origin rejection, throttling and browser registration.
- Apply migrations with `pnpm db:migrate`. Build/start deployment with `NEXT_BASE_PATH=/soandethi` on port 3210.
