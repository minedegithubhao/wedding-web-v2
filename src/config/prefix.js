let protocol = 'ws://' + window.location.host
if (window.location.protocol === 'https:') {
  protocol = 'wss://' + window.location.host
}
const sshWsUrl = protocol + '/websocket/webSSH/websocket'
// if (process.env.NODE_ENV === 'production') {
//   wsUrl = protocol + '192.168.1.231:8080/ws/scriptRunInfo?id='
//   sshWsUrl = protocol + '192.168.1.231:8080/webSSH/websocket'
// }
export default {
  OPEN_URL_PREFIX: '/openfile',
  SSH_WS_URL_PREFIX: sshWsUrl
}
