import { z } from 'zod'

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(50, 'Nome muito longo'),
  bio: z.string().max(200, 'Bio muito longa').optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  city: z.string().min(2, 'Cidade obrigatória').max(100),
})

export type EditProfileInput = z.infer<typeof editProfileSchema>
