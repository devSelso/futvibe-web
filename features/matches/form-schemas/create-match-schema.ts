import { z } from 'zod'

const today = () => new Date().toISOString().split('T')[0]

export const createMatchSchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
  location: z.string().min(3, 'Local deve ter ao menos 3 caracteres'),
  date: z
    .string()
    .min(1, 'Data obrigatória')
    .refine((d) => d >= today(), 'Data deve ser hoje ou futura'),
  time: z.string().min(1, 'Horário obrigatório'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], { message: 'Selecione o nível da partida' }),
  pricePerPlayer: z.number().min(0, 'Valor não pode ser negativo'),
  maxPlayers: z.number().min(2, 'Mínimo 2 vagas').max(20, 'Máximo 20 vagas'),
  visibility: z.enum(['public', 'private', 'hybrid'], { message: 'Selecione a visibilidade da partida' }),
})

export type CreateMatchInput = z.infer<typeof createMatchSchema>
