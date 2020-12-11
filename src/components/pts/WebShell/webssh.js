import prefix from '@/config/prefix'

const connection = {}

const client = {
  connect: (options, uuid) => {
    const endpoint = prefix.SSH_WS_URL_PREFIX
    if (window.WebSocket) {
      // 如果支持websocket
      connection[uuid] = new WebSocket(endpoint)
    } else {
      // 否则报错
      options.onError('WebSocket Not Supported', uuid)
      return
    }

    connection[uuid].onopen = function () {
      options.onConnect(uuid)
    }

    connection[uuid].onmessage = function (evt) {
      const data = evt.data.toString()
      options.onData(data, uuid)
    }

    connection[uuid].onclose = function (evt) {
      options.onClose(uuid)
    }
  },
  close: (uuid) => {
    connection[uuid].close()
  },
  send: (data, uuid) => {
    // 连接参数
    connection[uuid].send(JSON.stringify(data))
  },
  sendInitData: (options, uuid) => {
    // 连接参数
    connection[uuid].send(JSON.stringify(options))
  },
  sendClientData: (data, uuid) => {
    // 发送指令
    connection[uuid].send(JSON.stringify({ operate: 'command', command: data }))
  }
}
export default client
