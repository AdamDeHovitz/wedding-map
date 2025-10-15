-- Migration: Add Czech localization support
-- Adds Czech description column and language preference

-- Add Czech description column to wedding_tables
ALTER TABLE wedding_tables
ADD COLUMN description_cs TEXT;

-- Add language preference to user_preferences
ALTER TABLE user_preferences
ADD COLUMN preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'cs'));

-- Update Czech descriptions for existing locations
UPDATE wedding_tables SET description_cs = 'První domov Adama v Brooklynu, kde trávil hodně času hraním s legy a brouky.' WHERE unique_code = 'masha';
UPDATE wedding_tables SET description_cs = 'První společný domov Anny a Adama, kde si vybudovali plně vybavenou kuchyni, rozsáhlou sbírku knih a příliš mnoho bot' WHERE unique_code = 'scheibvitz';
UPDATE wedding_tables SET description_cs = 'Byt Adamovy mámy, kde pořádal svou první párty a kde byl poprvé při pořádání párty přistižen.' WHERE unique_code = 'promenade';
UPDATE wedding_tables SET description_cs = 'Na Swarthmore si Anna našla některé ze svých nejoblíbenějších lidí. Strávila hodiny filosofováním s přáteli z koleje Mertz, hraním tenisu a pitím přílišného množství white monster energetických nápojů pozdě v noci.' WHERE unique_code = 'mccabe';
UPDATE wedding_tables SET description_cs = 'Annin domov po ukončení studia, kde si udržovala vyvážený život práce jako asistentka právníka, studování na LSAT a podávání přihlášek na právnickou fakultu' WHERE unique_code = 'woodley-park';
UPDATE wedding_tables SET description_cs = 'Adamův první byt po vysoké škole, kde si vyvinul lásku k Dua Lipě, Carcassonne a vaření se spolubydlícími.' WHERE unique_code = 'FOURWORDSLOWERCASE';
UPDATE wedding_tables SET description_cs = 'Domov Anniných prarodičů v Albany, OR, kde trávila vánoční rána skákáním na dědečkově posteli a sdílela s babičkou lásku k puzzle.' WHERE unique_code = 'lightning';
UPDATE wedding_tables SET description_cs = 'Výlet do Prahy není kompletní bez krásné prohlídky města, večera s pitím se sestřenicemi a velkých rodinných jídel v hospodě.' WHERE unique_code = 'absinthe';
UPDATE wedding_tables SET description_cs = 'Annin dětský domov v Centralia, WA, milovaný pro svou krásnou zahradu a výhled na Mount Rainier. Legenda říká, že tam dodnes ukládá baletní špičky ve skříni...' WHERE unique_code = 'daisy';
UPDATE wedding_tables SET description_cs = 'Domov Adamových prarodičů z otcovy strany, kde trávil mnoho návštěv oceňováním umění, skládáním puzzle a obdivováním Golden Gate Bridge.' WHERE unique_code = 'pollock';
UPDATE wedding_tables SET description_cs = 'Domov rodiny DeHovitz-Goldfarb-Chaiken, kam se Adam přestěhoval na střední škole. Kdysi místo pozdního učení a deskových her, nyní místo nedělních rodinných večeří.' WHERE unique_code = 'lovelove';
UPDATE wedding_tables SET description_cs = 'Domov Adamovy mámy na Long Islandu, kde vybudovala útočiště pro ptáky, králíky, koťata, přátele a rodinu.' WHERE unique_code = 'peacock';
UPDATE wedding_tables SET description_cs = 'Adamův vysokoškolský domov, plný her Avalon, bratrských večírků a (ne)slavných brunchů.' WHERE unique_code = 'brunch';
UPDATE wedding_tables SET description_cs = 'Annin první domov na Columbia, kde přežila Zoom hodiny prvního ročníku práv a dvě newyorská léta bez klimatizace.' WHERE unique_code = 'briffault';
UPDATE wedding_tables SET description_cs = 'Byt Adama a Zacha (do kterého se Anna nastěhovala na tři měsíce přípravy na advokátní zkoušky)' WHERE unique_code = 'karahi';

-- Create index on preferred_language for better query performance
CREATE INDEX idx_user_preferences_language ON user_preferences(preferred_language);

COMMENT ON COLUMN wedding_tables.description_cs IS 'Czech translation of location description';
COMMENT ON COLUMN user_preferences.preferred_language IS 'User preferred language: en (English) or cs (Czech)';
