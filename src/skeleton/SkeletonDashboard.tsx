import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Dashboard page skeleton — matches real layout: status pills + 4 stat cards + chart/health + 9 summary cards + footer. */
export function SkeletonDashboard() {
  return (
    <div class="space-y-4 md:space-y-6">
      {/* Connection status pills */}
      <div class="flex flex-wrap items-center gap-2">
        <SkeletonBox width="140px" height="24px" class="rounded-full" />
        <SkeletonBox width="100px" height="24px" class="rounded-full" />
      </div>

      {/* Stat cards grid — 4 cards */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-2">
            <SkeletonLine width="60%" height="10px" />
            <SkeletonLine width="40%" height="24px" />
            <SkeletonLine width="70%" height="10px" />
          </div>
        ))}
      </div>

      {/* Token Usage Chart + Health Summary */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <div class="flex items-center justify-between">
            <SkeletonLine width="100px" height="14px" />
            <div class="flex gap-1">
              <SkeletonBox width="40px" height="24px" class="rounded-md" />
              <SkeletonBox width="30px" height="24px" class="rounded-md" />
              <SkeletonBox width="26px" height="24px" class="rounded-md" />
              <SkeletonBox width="30px" height="24px" class="rounded-md" />
            </div>
          </div>
          <div class="flex items-end gap-1 h-[140px]">
            <SkeletonBox width="8%" height="20%" class="rounded-sm" />
            <SkeletonBox width="8%" height="35%" class="rounded-sm" />
            <SkeletonBox width="8%" height="15%" class="rounded-sm" />
            <SkeletonBox width="8%" height="55%" class="rounded-sm" />
            <SkeletonBox width="8%" height="80%" class="rounded-sm" />
            <SkeletonBox width="8%" height="40%" class="rounded-sm" />
            <SkeletonBox width="8%" height="25%" class="rounded-sm" />
            <SkeletonBox width="8%" height="60%" class="rounded-sm" />
            <SkeletonBox width="8%" height="30%" class="rounded-sm" />
            <SkeletonBox width="8%" height="45%" class="rounded-sm" />
          </div>
        </div>
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <SkeletonLine width="120px" height="14px" />
          <div class="space-y-2">
            {Array.from({ length: 4 }).map(() => (
              <div class="flex items-center gap-2">
                <SkeletonBox width="8px" height="8px" class="rounded-full" />
                <SkeletonLine width="80%" height="12px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards grid — 9 cards in grid-cols-2 md:grid-cols-3 xl:grid-cols-4 */}
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {/* About Footer */}
      <div class="border-t border-border pt-4">
        <SkeletonLine width="200px" height="10px" />
      </div>
    </div>
  )
}
