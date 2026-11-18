-- Retire existing shared/passwordless demo user sessions, preserving paired capture devices.
delete from auth_sessions s using users u
where s.user_id = u.id and s.kind = 'user' and u.password_hash is null;
