import { SkeletonCard } from "./SkeletonCard"

/** Responsive grid of skeleton cards. */
export function SkeletonGrid(props: { cards?: number }) {
  const count = props.cards ?? 4
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map(() => <SkeletonCard />)}
    </div>
  )
}
