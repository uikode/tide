import { SkeletonCard } from "./SkeletonCard"
import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Stack Manager page skeleton — 4 component cards + action bar + panels. */
export function SkeletonStack() {
  return (
    <div class="space-y-6">
      {/* Component cards grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      {/* Action bar */}
      <div class="flex gap-2">
        <SkeletonBox width="90px" height="32px" class="rounded" />
        <SkeletonBox width="80px" height="32px" class="rounded" />
        <SkeletonBox width="100px" height="32px" class="rounded" />
      </div>
      {/* Panels */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <SkeletonLine width="100px" height="14px" />
          <SkeletonLine width="80%" height="10px" />
          <SkeletonLine width="60%" height="10px" />
        </div>
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <SkeletonLine width="80px" height="14px" />
          <SkeletonLine width="70%" height="10px" />
          <SkeletonBox width="120px" height="28px" class="rounded" />
        </div>
      </div>
    </div>
  )
}
