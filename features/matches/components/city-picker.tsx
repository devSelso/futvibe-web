'use client'

import { useEffect, useState } from 'react'

interface IbgeState {
  id: number
  sigla: string
  nome: string
}

// Module-level cache — fetched once per session, shared across all CityPicker instances
let cachedStates: IbgeState[] | null = null
let statesPromise: Promise<IbgeState[]> | null = null

function getStates(): Promise<IbgeState[]> {
  if (cachedStates) return Promise.resolve(cachedStates)
  if (!statesPromise) {
    statesPromise = fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((r) => r.json())
      .then((data: IbgeState[]) => { cachedStates = data; return data })
      .catch(() => [] as IbgeState[])
  }
  return statesPromise
}

interface IbgeCity {
  id: number
  nome: string
}

interface Props {
  value?: string // "Porto Alegre/RS"
  onChange: (value: string) => void
  className?: string
}

const selectClass =
  'w-full h-12 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50'

export function CityPicker({ value, onChange, className }: Props) {
  const [states, setStates] = useState<IbgeState[]>([])
  const [cities, setCities] = useState<IbgeCity[]>([])
  const [uf, setUf] = useState<string>('')
  const [cityName, setCityName] = useState<string>('')
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const slash = value.lastIndexOf('/')
      if (slash !== -1) {
        setCityName(value.slice(0, slash))
        setUf(value.slice(slash + 1))
      }
    }
  }, []) // run once on mount

  // Load states (cached per session)
  useEffect(() => {
    getStates()
      .then(setStates)
      .finally(() => setLoadingStates(false))
  }, [])

  // Load cities when UF changes
  useEffect(() => {
    if (!uf) { setCities([]); return }
    setLoadingCities(true)
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then((r) => r.json())
      .then((data: IbgeCity[]) => setCities(data))
      .catch(() => {})
      .finally(() => setLoadingCities(false))
  }, [uf])

  function handleUfChange(newUf: string) {
    setUf(newUf)
    setCityName('')
  }

  function handleCityChange(newCity: string) {
    setCityName(newCity)
    if (uf && newCity) onChange(`${newCity}/${uf}`)
  }

  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      <select
        value={uf}
        onChange={(e) => handleUfChange(e.target.value)}
        disabled={loadingStates}
        className="h-12 w-24 shrink-0 px-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        <option value="">UF</option>
        {states.map((s) => (
          <option key={s.id} value={s.sigla}>{s.sigla}</option>
        ))}
      </select>

      <select
        value={cityName}
        onChange={(e) => handleCityChange(e.target.value)}
        disabled={!uf || loadingCities}
        className={selectClass}
      >
        <option value="">
          {loadingCities ? 'Carregando...' : uf ? 'Selecione a cidade' : 'Selecione o estado primeiro'}
        </option>
        {cities.map((c) => (
          <option key={c.id} value={c.nome}>{c.nome}</option>
        ))}
      </select>
    </div>
  )
}
