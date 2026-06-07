import { SkeletonLine } from "./Skeleton"

/** Skeleton matching table layout (header + rows). */
export function SkeletonTable(props: { rows?: number }) {
  const rows = props.rows ?? 6
  return (
    <div class="space-y-2">
      {/* Header */}
      <div class="flex gap-4 px-3 py-2">
        <SkeletonLine width="80px" height="10px" />
        <SkeletonLine width="50px" height="10px" />
        <SkeletonLine width="40px" height="10px" />
        <SkeletonLine width="60px" height="10px" />
        <SkeletonLine width="50px" height="10px" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div class="flex gap-4 px-3 py-2.5 rounded border border-border bg-bg-secondary">
          <SkeletonLine width="90px" height="12px" />
          <SkeletonLine width="40px" height="12px" />
          <SkeletonLine width="30px" height="12px" />
          <SkeletonLine width="50px" height="12px" />
          <SkeletonLine width="60px" height="12px" />
        </div>
      ))}
    </div>
  )
}
