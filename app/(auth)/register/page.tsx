'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { register } from '@/features/profile/services/auth-service'
import { registerSchema } from '@/features/auth/form-schemas/register-schema'
import { CityPicker } from '@/features/matches/components/city-picker'
import type { RegisterInput } from '@/features/auth/form-schemas/register-schema'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
] as const

const inputClass =
  'w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
    level: 'beginner',
    city: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleChange(field: keyof RegisterInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const result = registerSchema.safeParse(form)
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
      const ok = await register(result.data)
      if (ok) {
        router.push('/')
      } else {
        setError('Não foi possível criar a conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">FutVibe</h1>
        <p className="text-muted-foreground mt-2 text-sm">Crie sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nome</label>
          <input
            type="text"
            autoComplete="name"
            className={inputClass}
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">E-mail</label>
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${inputClass} pr-10`}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
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

        <div className="space-y-1">
          <label className="text-sm font-medium">Cidade</label>
          <CityPicker
            value={form.city}
            onChange={(v) => handleChange('city', v)}
          />
          {fieldErrors.city && <p className="text-xs text-destructive">{fieldErrors.city}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nível</label>
          <select
            className={inputClass}
            value={form.level}
            onChange={(e) => handleChange('level', e.target.value)}
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.level && <p className="text-xs text-destructive">{fieldErrors.level}</p>}
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={loading}
        >
          <IconUserPlus size={18} className="mr-2" />
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="text-primary font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
