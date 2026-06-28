'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconArrowLeft, IconMapPin, IconCalendar, IconClock,
  IconUsers, IconCurrencyDollar, IconShare2, IconCheck, IconArrowRight,
} from '@tabler/icons-react'
import Link from 'next/link'
import { Button } from '@/lib/components/ui/button'
import { submitNewMatch } from '@/features/matches/services/match-service'
import { createMatchSchema } from '@/features/matches/form-schemas/create-match-schema'
import { CityPicker } from '@/features/matches/components/city-picker'
import { useShare } from '@/features/matches/hooks/use-share'
import type { MatchLevel, MatchVisibility } from '@/lib/types'

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

type Step = 'form' | 'preview' | 'created'

const inputClass =
  'w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring'

export default function CreateMatchPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [createdMatchId, setCreatedMatchId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<{
    title: string
    location: string
    city: string
    date: string
    time: string
    level: MatchLevel | ''
    pricePerPlayer: number
    maxPlayers: number
    visibility: MatchVisibility | ''
  }>({
    title: '',
    location: '',
    city: '',
    date: '',
    time: '',
    level: '',
    pricePerPlayer: 0,
    maxPlayers: 6,
    visibility: '',
  })
  const matchUrl = createdMatchId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/match/${createdMatchId}` : ''
  const { handleShare, copied } = useShare(form.title, matchUrl)

  const today = new Date().toISOString().split('T')[0]
  const set = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    setStep('preview')
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      const match = await submitNewMatch(form)
      setCreatedMatchId(match.id)
      setStep('created')
    } finally {
      setLoading(false)
    }
  }


  if (step === 'created' && createdMatchId) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6 gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <IconCheck size={28} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold mt-2">Partida criada!</h1>
          <p className="text-sm text-muted-foreground">{form.title}</p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full h-12 gap-2 font-semibold"
          >
            {copied ? (
              <>
                <IconCheck size={17} className="text-primary" />
                Link copiado!
              </>
            ) : (
              <>
                <IconShare2 size={17} />
                Compartilhar partida
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push(`/match/${createdMatchId}`)}
            className="w-full h-12 gap-2 font-semibold"
          >
            Ver partida
            <IconArrowRight size={17} />
          </Button>

          <button
            onClick={() => router.push('/')}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Ir para o feed
          </button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    const dateLabel = form.date
      ? new Date(form.date + 'T00:00').toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      : ''

    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button
            onClick={() => setStep('form')}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <IconArrowLeft size={20} />
          </button>
          <h1 className="font-semibold text-lg">Confirmar Partida</h1>
        </header>

        <div className="px-4 flex-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="font-semibold text-base">{form.title}</h2>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconMapPin size={14} className="shrink-0" />
              {form.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconCalendar size={14} className="shrink-0" />
              {dateLabel}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconClock size={14} className="shrink-0" />
              {form.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconUsers size={14} className="shrink-0" />
              {form.maxPlayers} vagas
            </div>
            {form.pricePerPlayer > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCurrencyDollar size={14} className="shrink-0" />
                R$ {form.pricePerPlayer} por pessoa
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {LEVEL_LABELS[form.level]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                {VISIBILITY_LABELS[form.visibility]}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{VISIBILITY_DESC[form.visibility]}</p>
        </div>

        <div className="sticky bottom-20 px-4 pt-4 pb-2 bg-background space-y-2">
          <Button
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Criando partida...' : 'Confirmar e Publicar'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setStep('form')}
            className="w-full h-11"
            disabled={loading}
          >
            Editar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 pt-5 pb-3">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="font-semibold text-lg">Nova Partida</h1>
      </header>

      <form onSubmit={handleFormSubmit} className="px-4 space-y-4 flex-1">
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
          {errors.level && <p className="text-xs text-destructive">{errors.level}</p>}
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
          {form.visibility && (
            <p className="text-xs text-muted-foreground mt-1">{VISIBILITY_DESC[form.visibility]}</p>
          )}
          {errors.visibility && <p className="text-xs text-destructive">{errors.visibility}</p>}
        </div>

        <div className="sticky bottom-20 pt-4 pb-2 bg-background">
          <Button type="submit" className="w-full h-12 text-base font-semibold gap-2" size="lg">
            Revisar Partida
            <IconArrowRight size={17} />
          </Button>
        </div>
      </form>
    </div>
  )
}
