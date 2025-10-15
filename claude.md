You are making a beautiful mobile-first website that sparks joy for use at a wedding.

The concept is that each table at the wedding is a place that the couple has lived in. Users will find codes
at the real life tables that allow them to check in at that location on the website.

While developing this site it is important to write clean, reusable code and to make sure we pass linter
rules. Also please conform with the style guide in STYLE.md and that tests still pass

Read DESIGN-GUIDE.md and STYLING_UPDATE.md for more design info

Read README.md for project info

Read SETUP.md for setup info

## User Experience Consistency

**CRITICAL**: The user experience must be consistent across all entry points to the site.

- The main page (`src/app/page.tsx`) and check-in page (`src/app/checkin/[code]/page.tsx`) must provide the same experience and functionality
- Both pages should have identical headers with the same navigation elements (settings button, etc.)
- Both pages should display the same venues (including the hardcoded Rule of Thirds venue)
- Users should have access to the same features regardless of how they arrive at the site
- When making changes to one page, always check if the same changes need to be applied to the other page to maintain consistency

## Internationalization (i18n)

**CRITICAL**: All user-facing text must support both English and Czech languages.

The site uses next-intl for internationalization with the following requirements:

- **Translation files**: All translations are stored in `messages/en.json` and `messages/cs.json`
- **Server components**: Use `getTranslations` from `next-intl/server` for async server components (pages)
- **Client components**: Use `useTranslations` hook from `next-intl` for client components
- **Locale detection**: Use `useLocale()` hook to detect the current language
- **Database content**: Location descriptions have both `description` (English) and `description_cs` (Czech) columns
  - Always check locale and display Czech description when available: `locale === 'cs' && item.description_cs ? item.description_cs : item.description`

### When adding or modifying UI:

1. **Never hardcode text strings** - Always use translation keys
2. **Add translations to BOTH language files** (`messages/en.json` and `messages/cs.json`)
3. **Use appropriate namespaces**: common, settings, checkin, messages, map, editMessage, etc.
4. **For database content**: Check if Czech versions exist and display based on locale
5. **Test in both languages** before considering the work complete

Example:
```typescript
// Server component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('common')
<button>{t('save')}</button>

// Client component
import { useTranslations } from 'next-intl'
const t = useTranslations('common')
<button>{t('save')}</button>
```

