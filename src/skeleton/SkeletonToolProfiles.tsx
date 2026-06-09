import { SkeletonLine, SkeletonBox } from "./Skeleton"

/** ToolProfilesPanel skeleton — matches real layout: summary bar + 5-column table + right detail panel. */
export function SkeletonToolProfiles() {
  return (
    <div class="space-y-3">
      {/* Reset button (top-right) */}
      <div class="flex justify-end">
        <SkeletonBox width="70px" height="28px" class="rounded" />
      </div>

      {/* Summary bar */}
      <div class="flex flex-wrap items-center gap-2">
        <SkeletonLine width="80px" height="10px" />
        <SkeletonLine width="60px" height="10px" />
        <SkeletonLine width="50px" height="10px" />
        <SkeletonLine width="50px" height="10px" />
      </div>

      {/* 2-column layout: table left + detail right */}
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4" style="align-items: start">
        {/* LEFT: Profile table */}
        <div class="overflow-x-auto rounded-lg border border-border bg-bg-secondary">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-bg-tertiary">
                <th class="px-2 py-1.5 text-left"><SkeletonLine width="40px" height="10px" /></th>
                <th class="px-2 py-1.5 text-center"><SkeletonLine width="30px" height="10px" class="mx-auto" /></th>
                <th class="px-2 py-1.5 text-center"><SkeletonLine width="40px" height="10px" class="mx-auto" /></th>
                <th class="px-2 py-1.5 text-center"><SkeletonLine width="25px" height="10px" class="mx-auto" /></th>
                <th class="px-2 py-1.5 text-left"><SkeletonLine width="35px" height="10px" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr class="border-b border-border/50">
                  <td class="px-2 py-1.5">
                    <div class="flex items-center gap-1">
                      <SkeletonBox width="12px" height="12px" class="rounded" />
                      <SkeletonLine width={`${60 + (i % 3) * 20}px`} height="11px" />
                    </div>
                  </td>
                  <td class="px-2 py-1.5 text-center"><SkeletonLine width="20px" height="11px" class="mx-auto" /></td>
                  <td class="px-2 py-1.5 text-center"><SkeletonLine width="35px" height="11px" class="mx-auto" /></td>
                  <td class="px-2 py-1.5 text-center"><SkeletonLine width="20px" height="11px" class="mx-auto" /></td>
                  <td class="px-2 py-1.5">
                    <SkeletonBox width="45px" height="16px" class="rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Detail panel placeholder */}
        <div class="rounded-lg border border-border bg-bg-secondary p-4 space-y-3 hidden xl:block">
          <SkeletonLine width="100px" height="14px" />
          <div class="space-y-2">
            <SkeletonLine width="80%" height="10px" />
            <SkeletonLine width="60%" height="10px" />
            <SkeletonLine width="70%" height="10px" />
          </div>
          <div class="pt-2 flex gap-2">
            <SkeletonBox width="60px" height="24px" class="rounded" />
            <SkeletonBox width="60px" height="24px" class="rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
