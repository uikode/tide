import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Dashboard page skeleton — stats row + summary cards grid + footer. */
export function SkeletonDashboard() {
  return (
    <div class="space-y-6">
      {/* Stats grid */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-4 text-center space-y-2">
            <SkeletonLine width="60%" height="24px" class="mx-auto" />
            <SkeletonLine width="80%" height="10px" class="mx-auto" />
          </div>
        ))}
      </div>
      {/* Summary cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 9 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-2">
            <div class="flex items-center gap-2">
              <SkeletonBox width="24px" height="24px" class="rounded" />
              <SkeletonLine width="100px" height="14px" />
            </div>
            <SkeletonLine width="70%" height="10px" />
            <SkeletonLine width="50%" height="10px" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div class="border-t border-border pt-4">
        <SkeletonLine width="200px" height="10px" />
      </div>
    </div>
  )
}
