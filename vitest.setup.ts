import '@testing-library/jest-dom'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local for tests
config({ path: resolve(__dirname, '.env.local') })
