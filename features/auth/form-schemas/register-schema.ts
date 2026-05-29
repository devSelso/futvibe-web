import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Selecione um nível',
  }),
})

export type RegisterInput = z.infer<typeof registerSchema>
