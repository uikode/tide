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

/** TideProvider — wraps app, manages shared WS connection. */
export function TideProvider(props: ParentProps<TideProviderProps>) {
  const [data, setData] = createSignal<any>(null)
  const [connected, setConnected] = createSignal(false)

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  function connect() {
    if (!props.ws?.url) return

    const protocol = props.ws.url.startsWith("wss") ? "wss:" : "ws:"
    const url = props.ws.url.startsWith("ws") ? props.ws.url : `${protocol}//${window.location.host}${props.ws.url}`

    ws = new WebSocket(url)

    ws.onopen = () => {
      setConnected(true)
      if (props.ws?.topics?.length) {
        for (const topic of props.ws.topics) {
          ws!.send(JSON.stringify({ action: "subscribe", topic }))
        }
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
      reconnectTimer = setTimeout(connect, 3000)
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
