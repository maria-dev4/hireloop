import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

// inferAdditionalFields tells this client about the custom fields defined
// in lib/auth.ts (e.g. "role"), so we can send them during sign-up.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
