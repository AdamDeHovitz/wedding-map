# Database Migrations

This directory contains SQL migration files for the Wedding Map database.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Open the migration file (`001-add-message-reads-table.sql`)
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute the migration

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to project root
cd /Users/adamdeho/Projects/wedding-map

# Apply the migration
supabase db reset  # This will apply all migrations in order
```

## Migration: 001 - Add Message Reads Table

**File**: `001-add-message-reads-table.sql`

**Purpose**: Adds message read tracking to help users identify which check-in messages they haven't seen yet.

**What it does**:
- Creates `message_reads` table to track when users read check-in messages
- Adds indexes for performance
- Sets up RLS (Row Level Security) policies
- Creates a trigger to automatically mark messages as unread when edited
- Ensures users can only see/modify their own read status

**Tables Created**:
- `message_reads`: Tracks which messages each user has read

**Triggers Created**:
- `trigger_mark_unread_on_edit`: Clears read status when a message is edited

## Verifying the Migration

After applying the migration, verify it worked:

```sql
-- Check that the table exists
SELECT * FROM message_reads LIMIT 1;

-- Check that the trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'trigger_mark_unread_on_edit';

-- Check that RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'message_reads';
```

## Rolling Back

If you need to roll back this migration:

```sql
-- Drop the trigger first
DROP TRIGGER IF EXISTS trigger_mark_unread_on_edit ON guest_checkins;
DROP FUNCTION IF EXISTS mark_message_as_unread_on_edit();

-- Drop the table (this will also drop all related data)
DROP TABLE IF EXISTS message_reads CASCADE;
```

**Warning**: Rolling back will delete all message read tracking data.

## Migration: 002 - Update Table Codes

**File**: `002-update-table-codes.sql`

**Purpose**: Updates unique codes for Clark Street and State Street tables.

**What it does**:
- Changes Clark Street code from `cannabispinoy` to `promenade`
- Changes State Street code from `hoyt-schermerhorn` to `lovelove`
- Old QR codes continue to work via app-level redirects

**Tables Modified**:
- `wedding_tables`: Updates `unique_code` field for two tables

**Backward Compatibility**:
The old codes continue to work because the check-in page includes redirect mappings. This means:
- Old QR codes with `cannabispinoy` will redirect to `promenade`
- Old QR codes with `hoyt-schermerhorn` will redirect to `lovelove`
- No need to regenerate QR codes unless desired

## Verifying Migration 002

After applying the migration:

```sql
-- Verify the codes were updated
SELECT name, unique_code
FROM wedding_tables
WHERE name IN ('Clark Street', 'State Street');

-- Expected results:
-- Clark Street | promenade
-- State Street | lovelove
```

## Migration: 003 - Add Description Field

**File**: `003-add-description-field.sql`

**Purpose**: Adds personalized descriptions to each location table.

**What it does**:
- Adds `description` TEXT column to `wedding_tables`
- Populates descriptions for all existing tables from the locations CSV
- Each description tells the story of that meaningful place

**Tables Modified**:
- `wedding_tables`: Adds `description` field

**Verifying Migration 003**:

```sql
-- Check that the column exists and has data
SELECT name, unique_code, description
FROM wedding_tables
WHERE description IS NOT NULL
ORDER BY name;
```

## Migration: 004 - Update Mertz to McCabe

**File**: `004-update-mertz-to-mccabe.sql`

**Purpose**: Updates unique code for Swarthmore table from 'mertz' to 'mccabe'.

**What it does**:
- Changes Swarthmore code from `mertz` to `mccabe`
- Old QR codes continue to work via app-level redirects

**Tables Modified**:
- `wedding_tables`: Updates `unique_code` field for Swarthmore

**Backward Compatibility**:
The old code continues to work because the check-in page includes redirect mappings. This means:
- Old QR codes with `mertz` will redirect to `mccabe`
- No need to regenerate QR codes unless desired

**Verifying Migration 004**:

```sql
-- Verify the code was updated
SELECT name, unique_code, address
FROM wedding_tables
WHERE address LIKE '%Swarthmore%';

-- Expected result:
-- Table name | mccabe | 500 College Ave, Swarthmore, PA 19081
```
