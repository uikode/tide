import { For } from "solid-js";

// Identical skeleton placeholders for all harnesses (same DOM as Tide's skeleton
// system would render; kept self-contained so competitors render the same fallback).

export function SkeletonCards(props: { n: number }) {
  return (
    <div class="grid">
      <For each={Array.from({ length: props.n })}>{() => <div class="card sk sk-card" />}</For>
    </div>
  );
}

export function SkeletonRows(props: { n: number }) {
  return (
    <div class="table">
      <For each={Array.from({ length: props.n })}>{() => <div class="sk sk-row" />}</For>
    </div>
  );
}
