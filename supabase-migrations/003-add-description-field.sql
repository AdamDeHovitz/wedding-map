-- Add description field to wedding_tables
-- Migration: 003-add-description-field.sql
-- Description: Adds a text field to store personalized descriptions for each location

-- Add the description column
ALTER TABLE wedding_tables
ADD COLUMN description TEXT;

-- Add descriptions for existing tables based on unique codes
UPDATE wedding_tables
SET description = 'Anna''s childhood home in Centralia, WA, beloved for its beautiful garden and view of Mount Rainier. Legend has it she is still storing pointe shoes in the closets to this day... '
WHERE unique_code = 'daisy';

UPDATE wedding_tables
SET description = 'Anna''s grandparents'' home in Albany, OR, where she spent Christmas mornings jumping on her grandfather''s bed and shared in her grandmother''s love for jigsaw puzzles.'
WHERE unique_code = 'lightning';

UPDATE wedding_tables
SET description = 'Anna''s post-college home, where she maintained a well-balanced life of working as a paralegal, studying for the LSAT, and applying to law school'
WHERE unique_code = 'woodley-park';

UPDATE wedding_tables
SET description = 'Anna''s first home at Columbia where she survived Zoom 1L classes and two NYC summers without air conditioning.'
WHERE unique_code = 'briffault';

UPDATE wedding_tables
SET description = 'At Swarthmore, Anna found some of her favorite people. She spent hours philosophizing with her Mertz Dorm friends, playing tennis, and drinking too many late-night white monster energy drinks.'
WHERE unique_code = 'mccabe';

UPDATE wedding_tables
SET description = 'Anna & Adam''s first home together, where they''ve lived happily for the last two years'
WHERE unique_code = 'scheibvitz';

UPDATE wedding_tables
SET description = 'Adam''s mom''s apartment, where he threw a party for the first time and got caught throwing a party for the first time.'
WHERE unique_code = 'promenade';

UPDATE wedding_tables
SET description = 'Adam''s first Brooklyn home, where they''ve curated a full stocked kitchen, an extensive book collection, and too many shoes'
WHERE unique_code = 'masha';

UPDATE wedding_tables
SET description = 'The DeHovitz-Goldfarb-Chaiken home where Adam moved in high school. Then the site of late-night studying and board games, now the site of Sunday family dinners.'
WHERE unique_code = 'lovelove';

UPDATE wedding_tables
SET description = 'Adam''s first apartment after college, where he developed a love for Dua Lipa, Carcassonne, and cooking with roommates.'
WHERE unique_code = 'FOURWORDSLOWERCASE';

UPDATE wedding_tables
SET description = 'Adam & Zach''s bachelor pad (that Anna moved into for three months of bar exam prep)'
WHERE unique_code = 'karahi';

UPDATE wedding_tables
SET description = 'Home of Adam''s paternal grandparents, where he spent many visits appreciating art, working on puzzles, and admiring the Golden Gate Bridge.'
WHERE unique_code = 'pollock';

UPDATE wedding_tables
SET description = 'A trip to Prague isn''t complete without a beautiful city tour, a night drinking with cousins, and big family meals at a hospoda.'
WHERE unique_code = 'absinthe';

UPDATE wedding_tables
SET description = 'Adam''s college home, full of Avalon games, fraternity parties, and (in)famous brunches.'
WHERE unique_code = 'brunch';

UPDATE wedding_tables
SET description = 'Adam''s mom''s home on Long Island, where she built a sanctuary for birds, bunnies, kittens, friends, and family.'
WHERE unique_code = 'peacock';
