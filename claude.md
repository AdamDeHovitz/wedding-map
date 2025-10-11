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

