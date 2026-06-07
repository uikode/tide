import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Skeleton matching ComponentCard layout (name + status + stats + buttons). */
export function SkeletonCard() {
  return (
    <div class="rounded-lg border border-border bg-bg-secondary p-4 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <SkeletonLine width="80px" height="14px" />
        <SkeletonLine width="50px" height="14px" />
      </div>
      <div class="space-y-2">
        <div class="flex justify-between"><SkeletonLine width="30px" height="10px" /><SkeletonLine width="40px" height="10px" /></div>
        <div class="flex justify-between"><SkeletonLine width="30px" height="10px" /><SkeletonLine width="50px" height="10px" /></div>
        <div class="flex justify-between"><SkeletonLine width="40px" height="10px" /><SkeletonLine width="35px" height="10px" /></div>
      </div>
      <div class="flex gap-2 mt-auto pt-2 border-t border-border">
        <SkeletonBox width="60px" height="28px" class="rounded" />
        <SkeletonBox width="60px" height="28px" class="rounded" />
      </div>
    </div>
  )
}
