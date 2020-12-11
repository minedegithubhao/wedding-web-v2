
export const createWebSocket = function(url, webSocketOnMessage, webSocketOnOpen
  , webSocketOnError, webSocketOnClose) {
  const webSocket = new WebSocket(url)
  webSocket.onmessage = webSocketOnMessage
  webSocket.onopen = webSocketOnOpen
  webSocket.onerror = webSocketOnError
  webSocket.onclose = webSocketOnClose
  return webSocket
}
