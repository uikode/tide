import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** Scheduler page skeleton — matches real layout: 4 stat cards + 7-column task table. */
export function SkeletonScheduler() {
  return (
    <div class="space-y-6">
      {/* Stats row — 4 cards: Tasks, Total Runs, Errors, PID */}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map(() => (
          <div class="rounded-lg border border-border bg-bg-secondary p-3 text-center space-y-2">
            <SkeletonLine width="40px" height="24px" class="mx-auto" />
            <SkeletonLine width="60px" height="10px" class="mx-auto" />
          </div>
        ))}
      </div>

      {/* Task table — 7 columns matching TaskTable */}
      <div class="overflow-x-auto rounded-lg border border-border">
        <table class="w-full text-sm">
          <thead class="bg-bg-secondary">
            <tr class="text-left text-xs text-text-muted">
              <th class="px-3 py-2"><SkeletonLine width="30px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="40px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="30px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="50px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="50px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="35px" height="10px" /></th>
              <th class="px-3 py-2"><SkeletonLine width="45px" height="10px" /></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {Array.from({ length: 11 }).map(() => (
              <tr>
                <td class="px-3 py-2"><SkeletonLine width="80px" height="12px" /></td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1.5">
                    <SkeletonBox width="8px" height="8px" class="rounded-full" />
                    <SkeletonLine width="40px" height="10px" />
                  </div>
                </td>
                <td class="px-3 py-2"><SkeletonLine width="25px" height="12px" /></td>
                <td class="px-3 py-2"><SkeletonLine width="50px" height="12px" /></td>
                <td class="px-3 py-2"><SkeletonLine width="35px" height="12px" /></td>
                <td class="px-3 py-2"><SkeletonLine width="20px" height="12px" /></td>
                <td class="px-3 py-2">
                  <div class="flex gap-1">
                    <SkeletonBox width="24px" height="24px" class="rounded" />
                    <SkeletonBox width="24px" height="24px" class="rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
