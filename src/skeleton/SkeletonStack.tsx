import { SkeletonCard } from "./SkeletonCard"
import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Stack Manager page skeleton — matches real layout: 5 component cards + actions + OsService/Updates panels. */
export function SkeletonStack() {
  return (
    <div class="space-y-6">
      {/* Component cards grid — 5 cards matching real xl:grid-cols-5 */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* StackActions bar — Start All / Stop All / Restart All */}
      <div class="rounded-lg border border-border bg-bg-secondary p-3 flex items-center gap-2">
        <SkeletonBox width="90px" height="32px" class="rounded" />
        <SkeletonBox width="80px" height="32px" class="rounded" />
        <SkeletonBox width="100px" height="32px" class="rounded" />
      </div>

      {/* Bottom panels: OsServicePanel + StackUpdatePanel */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OS Service Panel */}
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <SkeletonLine width="100px" height="14px" />
          <div class="space-y-2">
            <div class="flex justify-between"><SkeletonLine width="80px" height="10px" /><SkeletonLine width="60px" height="10px" /></div>
            <div class="flex justify-between"><SkeletonLine width="60px" height="10px" /><SkeletonLine width="40px" height="10px" /></div>
          </div>
          <div class="flex gap-2 pt-2">
            <SkeletonBox width="80px" height="28px" class="rounded" />
            <SkeletonBox width="90px" height="28px" class="rounded" />
          </div>
        </div>

        {/* Stack Updates Panel — table with header + rows */}
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3">
          <div class="flex items-center justify-between">
            <SkeletonLine width="100px" height="14px" />
            <SkeletonBox width="70px" height="24px" class="rounded" />
          </div>
          {/* Table header */}
          <div class="flex gap-4 py-1.5 border-b border-border">
            <SkeletonLine width="80px" height="10px" />
            <SkeletonLine width="50px" height="10px" />
            <SkeletonLine width="50px" height="10px" />
            <SkeletonLine width="40px" height="10px" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 5 }).map(() => (
            <div class="flex gap-4 py-2 border-b border-border/50">
              <SkeletonLine width="70px" height="12px" />
              <SkeletonLine width="45px" height="12px" />
              <SkeletonLine width="45px" height="12px" />
              <SkeletonLine width="20px" height="12px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
