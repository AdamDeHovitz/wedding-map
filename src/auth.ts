import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

/**
 * Authentication Configuration
 *
 * IMPORTANT: Username and Email Field Usage
 * -----------------------------------------
 * This app uses the database 'email' field to store BOTH:
 * 1. Email addresses (from Google OAuth)
 * 2. Usernames (from credentials login)
 *
 * Why? Not everyone has a Gmail account, so we offer username login.
 * The 'email' field is defined as TEXT in the database, so it can store
 * any string. To prevent conflicts:
 * - Usernames CANNOT contain '@' symbol
 * - This ensures usernames and emails never collide
 *
 * Example:
 * - Google OAuth user: email = "alice@gmail.com"
 * - Username user: email = "bob_smith" (no @ symbol allowed)
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Username',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your unique username" }
      },
      async authorize(credentials) {
        const username = credentials?.username?.toString().trim()

        // Validation: username required
        if (!username) {
          throw new Error('Username is required')
        }

        // CRITICAL: Username cannot be an email to prevent collision with Google OAuth users
        if (username.includes('@')) {
          throw new Error('Username cannot contain @ symbol. Please choose a username without @')
        }

        // Minimum length requirement
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters')
        }

        // Maximum length to prevent abuse
        if (username.length > 30) {
          throw new Error('Username must be 30 characters or less')
        }

        // Alphanumeric + underscore/dash only
        const validUsernamePattern = /^[a-zA-Z0-9_-]+$/
        if (!validUsernamePattern.test(username)) {
          throw new Error('Username can only contain letters, numbers, underscores, and dashes')
        }

        // Return user object
        // NOTE: We store username in the 'email' field for database consistency
        // The database schema uses 'email' as the primary key for user_preferences
        return {
          id: username,
          email: username,  // Username stored in email field (see comment above)
          name: username,   // Display name defaults to username
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnCheckIn = nextUrl.pathname.startsWith('/checkin')

      if (isOnCheckIn && !isLoggedIn) {
        return false
      }

      return true
    },
  },
})
