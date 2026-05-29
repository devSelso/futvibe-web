import { IconStar, IconStarFilled } from '@tabler/icons-react'

interface StarRatingProps {
  value: number
  max?: number
  size?: number
}

export function StarRating({ value, max = 5, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value)
        return filled
          ? <IconStarFilled key={i} size={size} className="text-amber-400" />
          : <IconStar key={i} size={size} className="text-muted-foreground" />
      })}
      <span className="text-xs text-muted-foreground ml-1">{value.toFixed(1)}</span>
    </div>
  )
}
