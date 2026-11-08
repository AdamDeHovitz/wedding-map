-- Move wedding-map out of `public` into its own `wedding_map` schema, so this
-- Supabase project can also host readers-choice's staging database in
-- `public` (which readers-choice resets on every preview load).
--
-- Policies, indexes, triggers, sequences and table grants move with the tables.
-- After running this, `wedding_map` must be in the Data API's exposed schemas.

BEGIN;

CREATE SCHEMA wedding_map;
GRANT USAGE ON SCHEMA wedding_map TO anon, authenticated, service_role;

ALTER TABLE public.wedding_tables   SET SCHEMA wedding_map;
ALTER TABLE public.guest_checkins   SET SCHEMA wedding_map;
ALTER TABLE public.user_preferences SET SCHEMA wedding_map;
ALTER TABLE public.message_reads    SET SCHEMA wedding_map;
ALTER TABLE public.message_hearts   SET SCHEMA wedding_map;

ALTER FUNCTION public.mark_message_as_unread_on_edit() SET SCHEMA wedding_map;
-- The trigger body refers to message_reads unqualified; pin its lookup.
ALTER FUNCTION wedding_map.mark_message_as_unread_on_edit()
  SET search_path = wedding_map;

-- Same defaults Supabase gives `public`, for any future tables.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wedding_map
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wedding_map
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wedding_map
  GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

COMMIT;
