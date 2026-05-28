'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconLogin } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { login } from '@/features/profile/services/auth-service'
import { loginSchema } from '@/features/auth/form-schemas/login-schema'

const TEST_EMAIL = 'teste@futvibe.app'
const TEST_PASSWORD = '123456'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errs: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        errs[field] = issue.message
      }
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      const ok = await login(email, password)
      if (ok) {
        router.push('/')
      } else {
        setError('E-mail ou senha incorretos.')
      }
    } finally {
      setLoading(false)
    }
  }

  function fillTestUser() {
    setEmail(TEST_EMAIL)
    setPassword(TEST_PASSWORD)
    setError(null)
    setFieldErrors({})
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">FutVibe</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Organize suas partidas de futevôlei
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">E-mail</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="w-full h-12 px-3 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={loading}
        >
          <IconLogin size={18} className="mr-2" />
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="w-full max-w-xs">
        <div className="relative flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={fillTestUser}
          className="w-full h-11 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Usar usuário de teste
        </button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{TEST_EMAIL}</span>
          {' · '}
          <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{TEST_PASSWORD}</span>
        </p>
      </div>
    </div>
  )
}
