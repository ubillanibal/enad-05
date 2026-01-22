const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEAM = import.meta.env.VITE_TEAM_SLUG
const APP = import.meta.env.VITE_APP_SLUG
const TOKEN = import.meta.env.VITE_API_TOKEN

export async function apiGet(path) {
  const response = await fetch(
    `${BASE_URL}/api/v1/${TEAM}/${APP}${path}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  return response.json()
}