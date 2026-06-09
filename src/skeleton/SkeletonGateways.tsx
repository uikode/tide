import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Gateways page skeleton — matches real layout: search + filter toolbar + 5 vertical gateway cards. */
export function SkeletonGateways() {
  return (
    <div class="space-y-2">
      {/* Search input */}
      <SkeletonBox width="100%" height="38px" class="rounded border border-border" />

      {/* Toolbar: filter buttons + pagination */}
      <div class="flex items-center justify-between gap-2">
        <div class="flex gap-1">
          <SkeletonBox width="36px" height="28px" class="rounded" />
          <SkeletonBox width="56px" height="28px" class="rounded" />
          <SkeletonBox width="56px" height="28px" class="rounded" />
        </div>
        <div class="flex items-center gap-1.5">
          <SkeletonBox width="20px" height="20px" class="rounded" />
          <SkeletonLine width="70px" height="12px" />
          <SkeletonBox width="20px" height="20px" class="rounded" />
          <SkeletonBox width="32px" height="20px" class="rounded" />
        </div>
      </div>

      {/* Gateway cards — vertical list */}
      <div class="space-y-2">
        {Array.from({ length: 5 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <SkeletonBox width="8px" height="8px" class="rounded-full shrink-0" />
              <div class="space-y-1 flex-1">
                <SkeletonLine width="120px" height="14px" />
                <SkeletonLine width="80px" height="10px" />
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <SkeletonBox width="50px" height="24px" class="rounded" />
              <SkeletonBox width="50px" height="24px" class="rounded" />
              <SkeletonBox width="24px" height="24px" class="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
