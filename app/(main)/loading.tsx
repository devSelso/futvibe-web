function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
        <div className="h-6 w-20 bg-muted rounded-full shrink-0" />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="h-3 bg-muted rounded w-28" />
        <div className="h-3 bg-muted rounded w-16" />
        <div className="h-3 bg-muted rounded w-12 ml-auto" />
      </div>
      <div className="h-3 bg-muted rounded w-24 mt-3" />
    </div>
  )
}

export default function FeedLoading() {
  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div className="space-y-1">
        <div className="h-7 bg-muted rounded w-28 animate-pulse" />
        <div className="h-4 bg-muted rounded w-40 animate-pulse" />
      </div>

      <div className="w-full bg-muted rounded-xl animate-pulse" style={{ aspectRatio: '16/7' }} />

      <div className="flex gap-2 animate-pulse">
        {[80, 96, 112, 80, 72].map((w, i) => (
          <div key={i} className="h-8 bg-muted rounded-full shrink-0" style={{ width: w }} />
        ))}
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
