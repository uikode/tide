import { ParentProps } from "solid-js"

/** Base shimmer wrapper — applies pulse animation to children. */
export function Skeleton(props: ParentProps<{ class?: string }>) {
  return <div class={`animate-pulse ${props.class ?? ""}`}>{props.children}</div>
}

/** Horizontal shimmer bar — for text placeholders. */
export function SkeletonLine(props: { width?: string; height?: string; class?: string }) {
  return (
    <div
      class={`skeleton-shimmer ${props.class ?? ""}`}
      style={{ width: props.width ?? "100%", height: props.height ?? "12px" }}
    />
  )
}

/** Rectangle shimmer block — for cards, images, sections. */
export function SkeletonBox(props: { width?: string; height?: string; class?: string }) {
  return (
    <div
      class={`skeleton-shimmer rounded-lg ${props.class ?? ""}`}
      style={{ width: props.width ?? "100%", height: props.height ?? "60px" }}
    />
  )
}

/** Circle shimmer — for avatars, status dots. */
export function SkeletonCircle(props: { size?: string; class?: string }) {
  const s = props.size ?? "32px"
  return (
    <div
      class={`skeleton-shimmer rounded-full ${props.class ?? ""}`}
      style={{ width: s, height: s }}
    />
  )
}
