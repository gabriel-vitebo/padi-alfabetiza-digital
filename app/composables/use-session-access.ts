import type { SurveyMode } from '#shared/diagnostic'
export type SavedSession = { completed: boolean; sessionId: string; accessToken?: string; answers?: Record<string, string> }
export const sessionStorageKey = (mode: SurveyMode) => `padi:${mode}:v2`
export function useSessionAccess() {
  // Keep access during this visit even when the browser refuses localStorage.
  const tokens = useState<Record<string, string>>('session-access-tokens', () => ({}))
  function remember(id: string, token: string) { tokens.value[id] = token }
  function tokenFor(id: string) {
    if (tokens.value[id]) return tokens.value[id]
    if (import.meta.client) {
      for (const mode of ['research','fair'] as const) {
        try {
          const saved = JSON.parse(localStorage.getItem(sessionStorageKey(mode)) || 'null') as SavedSession | null
          if (saved?.sessionId === id && /^[A-Za-z0-9_-]{43}$/.test(saved.accessToken ?? '')) {
            remember(id, saved.accessToken!)
            return saved.accessToken
          }
        } catch { /* Missing or malformed storage never authorizes access. */ }
      }
    }
    return undefined
  }
  function headers(id: string) { return { Authorization: `Bearer ${tokenFor(id) ?? ''}` } }
  return { remember, tokenFor, headers }
}
