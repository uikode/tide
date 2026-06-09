import { createSignal, createContext, useContext, onCleanup, ParentProps } from "solid-js"
import type { Accessor } from "solid-js"
import type { TideWSConfig, TideProviderProps } from "./types"

interface TideWSState {
  data: Accessor<any>
  connected: Accessor<boolean>
}

const TideWSContext = createContext<TideWSState>({
  data: () => null,
  connected: () => false,
})

/** Access the latest WS message data from any createTide instance. */
export function useTideWS(): Accessor<any> {
  return useContext(TideWSContext).data
}

/** Check if WS is currently connected. */
export function useTideWSConnected(): Accessor<boolean> {
  return useContext(TideWSContext).connected
}

/** TideProvider — wraps app, manages shared WS connection with backoff + heartbeat. */
export function TideProvider(props: ParentProps<TideProviderProps>) {
  const [data, setData] = createSignal<any>(null)
  const [connected, setConnected] = createSignal(false)

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null

  // Backoff config
  const backoffEnabled = props.reconnect !== false
  const backoffBase = (typeof props.reconnect === "object" ? props.reconnect.baseMs : undefined) ?? 1000
  const backoffMax = (typeof props.reconnect === "object" ? props.reconnect.maxMs : undefined) ?? 30000
  let reconnectDelay = backoffBase

  // Heartbeat config
  const heartbeatEnabled = props.heartbeat !== false
  const heartbeatInterval = (typeof props.heartbeat === "number" ? props.heartbeat : undefined) ?? 25000

  function connect() {
    if (!props.ws?.url) return

    const protocol = props.ws.url.startsWith("wss") ? "wss:" : "ws:"
    const url = props.ws.url.startsWith("ws") ? props.ws.url : `${protocol}//${window.location.host}${props.ws.url}`

    ws = new WebSocket(url)

    ws.onopen = () => {
      setConnected(true)
      // Reset backoff on successful connection
      reconnectDelay = backoffBase
      // Subscribe to topics
      if (props.ws?.topics?.length) {
        for (const topic of props.ws.topics) {
          ws!.send(JSON.stringify({ action: "subscribe", topic }))
        }
      }
      // Start heartbeat
      if (heartbeatEnabled) {
        heartbeatTimer = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "ping" }))
          }
        }, heartbeatInterval)
      }
    }

    ws.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data))
      } catch {
        // ignore malformed
      }
    }

    ws.onclose = () => {
      setConnected(false)
      ws = null
      // Clear heartbeat
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer)
        heartbeatTimer = null
      }
      // Reconnect with backoff
      if (backoffEnabled) {
        reconnectTimer = setTimeout(connect, reconnectDelay)
        reconnectDelay = Math.min(reconnectDelay * 2, backoffMax)
      } else {
        // v1.0 behavior: fixed 3s reconnect
        reconnectTimer = setTimeout(connect, 3000)
      }
    }

    ws.onerror = () => {
      // onclose will fire after this
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
    if (ws) {
      ws.onclose = null
      ws.close()
      ws = null
    }
    setConnected(false)
  }

  // Auto-connect on mount
  if (props.ws?.url) connect()

  onCleanup(disconnect)

  return (
    <TideWSContext.Provider value={{ data, connected }}>
      {props.children}
    </TideWSContext.Provider>
  )
}

export { TideWSContext }
