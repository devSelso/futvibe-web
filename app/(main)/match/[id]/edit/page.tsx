'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { Button } from '@/lib/components/ui/button'
import { editMatch, fetchMatchById } from '@/features/matches/services/match-service'
import { createMatchSchema } from '@/features/matches/form-schemas/create-match-schema'
import { CityPicker } from '@/features/matches/components/city-picker'
import type { MatchLevel, MatchVisibility } from '@/lib/types'
import { useEffect } from 'react'

const LEVEL_LABELS: Record<MatchLevel, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const VISIBILITY_LABELS: Record<MatchVisibility, string> = {
  public: 'Pública',
  hybrid: 'Híbrida',
  private: 'Privada',
}

const VISIBILITY_DESC: Record<MatchVisibility, string> = {
  public: 'Aparece no feed. Entrada requer aprovação.',
  hybrid: 'Feed público + link com entrada automática.',
  private: 'Só acessível via link. Entrada automática.',
}

const inputClass =
  'w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring'

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    title: '',
    location: '',
    city: '',
    date: '',
    time: '',
    level: 'intermediate' as MatchLevel,
    pricePerPlayer: 0,
    maxPlayers: 6,
    visibility: 'hybrid' as MatchVisibility,
  })

  const today = new Date().toISOString().split('T')[0]
  const set = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  useEffect(() => {
    fetchMatchById(id).then((match) => {
      if (match) {
        setForm({
          title: match.title,
          location: match.location,
          city: match.city,
          date: match.date,
          time: match.time,
          level: match.level,
          pricePerPlayer: match.pricePerPlayer,
          maxPlayers: match.maxPlayers,
          visibility: match.visibility,
        })
      }
      setFetching(false)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = createMatchSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await editMatch(id, result.data)
      router.push(`/match/${id}`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center gap-3 px-4 pt-5 pb-3">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        </header>
        <div className="px-4 space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 pt-5 pb-3">
        <Link href={`/match/${id}`} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="font-semibold text-lg">Editar Partida</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 space-y-4 flex-1">
        <div className="space-y-1">
          <label className="text-sm font-medium">Título</label>
          <input
            className={inputClass}
            placeholder="Ex: Pelada da Barra — Sábado"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Localidade</label>
          <CityPicker value={form.city} onChange={(v) => set('city', v)} />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Local</label>
          <input
            className={inputClass}
            placeholder="Ex: Arena 7, Quadra Central"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
          />
          {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Data</label>
            <input
              type="date"
              min={today}
              className={inputClass}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Horário</label>
            <input
              type="time"
              className={inputClass}
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
            />
            {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nível</label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as MatchLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => set('level', lvl)}
                className={`h-10 rounded-lg text-sm font-medium border transition-colors ${
                  form.level === lvl
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input text-muted-foreground'
                }`}
              >
                {LEVEL_LABELS[lvl]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Vagas</label>
            <input
              type="number"
              min={2}
              max={20}
              className={inputClass}
              value={form.maxPlayers}
              onChange={(e) => set('maxPlayers', Number(e.target.value))}
            />
            {errors.maxPlayers && <p className="text-xs text-destructive">{errors.maxPlayers}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Valor por pessoa (R$)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.pricePerPlayer}
              onChange={(e) => set('pricePerPlayer', Number(e.target.value))}
            />
            {errors.pricePerPlayer && <p className="text-xs text-destructive">{errors.pricePerPlayer}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Visibilidade</label>
          <div className="grid grid-cols-3 gap-2">
            {(['public', 'hybrid', 'private'] as MatchVisibility[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set('visibility', v)}
                className={`h-10 rounded-lg text-sm font-medium border transition-colors ${
                  form.visibility === v
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input text-muted-foreground'
                }`}
              >
                {VISIBILITY_LABELS[v]}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{VISIBILITY_DESC[form.visibility]}</p>
        </div>

        <div className="sticky bottom-20 pt-4 pb-2 bg-background">
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
