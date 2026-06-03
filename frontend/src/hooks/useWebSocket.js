import { useEffect, useRef, useState, useCallback } from 'react'

export default function useWebSocket(url) {
  const ws = useRef(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    ws.current = new WebSocket(url)
    ws.current.onopen = () => setConnected(true)
    ws.current.onclose = () => setConnected(false)
    ws.current.onerror = () => setConnected(false)
    ws.current.onmessage = (e) => {
      try { setLastMessage(JSON.parse(e.data)) } catch {}
    }
    return () => ws.current?.close()
  }, [url])

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN)
      ws.current.send(JSON.stringify(data))
  }, [])

  return { send, lastMessage, connected }
}
