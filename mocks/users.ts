import type { User } from '@/lib/types'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Rafael Costa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael',
    level: 'advanced',
    bio: 'Jogando futevôlei há 8 anos. Apaixonado pelo esporte.',
    presenceScore: 98,
    matchesPlayed: 142,
  },
  {
    id: 'u2',
    name: 'Juliana Melo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana',
    level: 'intermediate',
    bio: 'Competidora nos fins de semana. Sempre em busca de bons parceiros.',
    presenceScore: 91,
    matchesPlayed: 67,
  },
  {
    id: 'u3',
    name: 'Bruno Alves',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno',
    level: 'beginner',
    bio: 'Novo no esporte, mas com muita vontade de aprender.',
    presenceScore: 75,
    matchesPlayed: 12,
  },
  {
    id: 'u4',
    name: 'Camila Torres',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila',
    level: 'advanced',
    bio: 'Ex-vôlei de praia. Migrei para o futevôlei e não me arrependo.',
    presenceScore: 96,
    matchesPlayed: 89,
  },
  {
    id: 'u5',
    name: 'Diego Nunes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    level: 'intermediate',
    bio: 'Jogo toda semana na Barra. Bora marcar!',
    presenceScore: 84,
    matchesPlayed: 45,
  },
]

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}
