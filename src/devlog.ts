/** Dev-mode logging for tide cache/fetch events. Silent in production. */
export function devLog(key: string, event: string, detail?: any): void {
  if (import.meta.env.DEV) {
    console.log(
      `%c[tide:${key}]%c ${event}`,
      "color:#818cf8;font-weight:bold",
      "color:inherit",
      detail ?? ""
    )
  }
}
