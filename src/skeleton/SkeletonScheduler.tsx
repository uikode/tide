import { SkeletonLine } from "./Skeleton"
import { SkeletonTable } from "./SkeletonTable"

/** Scheduler page skeleton — stats row + task table. */
export function SkeletonScheduler() {
  return (
    <div class="space-y-6">
      {/* Stats row */}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-3 text-center space-y-2">
            <SkeletonLine width="40px" height="24px" class="mx-auto" />
            <SkeletonLine width="60px" height="10px" class="mx-auto" />
          </div>
        ))}
      </div>
      {/* Task table */}
      <SkeletonTable rows={11} />
    </div>
  )
}
