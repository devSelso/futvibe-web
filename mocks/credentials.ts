interface Credential {
  userId: string
  email: string
  password: string
}

export const mockCredentials: Credential[] = [
  { userId: 'u1', email: 'teste@futvibe.app', password: '123456' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function authenticate(email: string, password: string): Promise<string | null> {
  await delay(400 + Math.random() * 200)
  const match = mockCredentials.find(
    (c) => c.email === email && c.password === password
  )
  return match?.userId ?? null
}
