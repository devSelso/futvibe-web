'use client'

import { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { useUpdateProfile } from '@/features/profile/hooks/use-update-profile'
import { editProfileSchema } from '@/features/profile/form-schemas/edit-profile-schema'
import { useToast } from '@/lib/providers/toast-context'
import { updateCity } from '@/lib/auth'
import { CityPicker } from '@/features/matches/components/city-picker'
import type { MatchLevel } from '@/features/matches/types'
import type { User } from '@/features/profile/types'

const LEVEL_LABELS: Record<MatchLevel, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

interface Props {
  user: User
  onClose: () => void
  onSave: () => void
}

export function EditProfileModal({ user, onClose, onSave }: Props) {
  const updateProfile = useUpdateProfile()
  const { addToast } = useToast()

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio ?? '',
    level: user.level,
    city: user.city ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSave() {
    const result = editProfileSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    updateProfile.mutate(
      { name: result.data.name, bio: result.data.bio, level: result.data.level, city: result.data.city },
      { onSuccess: () => { updateCity(result.data.city); onSave(); onClose(); addToast('Perfil atualizado!', 'success') } }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90dvh] overflow-y-auto p-5 pb-6 sm:pb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Editar Perfil</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <IconX size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nome</label>
          <input
            className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Cidade</label>
          <CityPicker
            value={form.city}
            onChange={(v) => setForm((p) => ({ ...p, city: v }))}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Nível</label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as MatchLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm((p) => ({ ...p, level: lvl }))}
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

        <Button onClick={handleSave} className="w-full h-11" disabled={!form.name.trim()}>
          Salvar
        </Button>
      </div>
    </div>
  )
}
