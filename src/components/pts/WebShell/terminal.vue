<template>
  <div id="terminal" ref="terminal" :style="{ marginLeft: showDrawer ? drawerWidth : '0px' }"></div>
</template>

<script>
/* eslint-disable */
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import 'xterm/lib/xterm.js'
import { createUuid } from '@/utils/util'
import client from './webssh.js'

/* eslint-disable */
export default {
  name: 'WebShellTerminal',
  components: {},
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerWidth: {
      type: String,
      default: '165px'
    },
    termData: {
      type: Object,
      default: () => {}
    },
    termName: {
      type: String,
      default: 'WebShell'
    }
  },
  data() {
    return {
      term: '',
      uuid: ''
    }
  },
  computed: {},
  watch: {
    // termData: {
    //   handler: function(val, oldVal) {
    //     this.handleConnect(val)
    //   },
    //   deep: true
    // }
  },
  created() {},
  mounted() {
    this.uuid = createUuid()
    this.initTerm(this.uuid)
  },
  beforeDestroy() {
    client.close(this.uuid)
  },
  methods: {
    initTerm(uuid) {
      const _this = this
      // 获取容器宽高/字号大小，定义行数和列数
      // const terminalContainer = document.getElementById('terminal')
      const terminalContainer = this.$refs.terminal
      // const rows = (terminalContainer.offsetHeight) / 16;
      // this.cols = terminalContainer.offsetWidth / 14;
      // 创建xterm实例
      let term = new Terminal({
        rendererType: 'dom',
        // cols: 120,
        // rows: parseInt(rows),
        convertEol: true, // 启用时，光标将设置为下一行的开头
        // scrollback: 50, // 终端中的回滚量
        disableStdin: false, // 是否应禁用输入。
        cursorStyle: 'underline', // 光标样式  null | 'block' | 'underline' | 'bar'
        cursorBlink: true, // 光标闪烁
        tabStopWidth: 8, // 制表宽度
        theme: {
          // foreground: '#7e9192', // 字体
          background: '#2b2b2b', // 背景色
          cursor: 'help', // 设置光标
          lineHeight: 30,
          foreground: '#dbdbdb'
        }
      }) // 创建一个新的Terminal对象
      term.open(terminalContainer) // 将term挂载到dom节点上
      // 换行并输入起始符“$”
      term.prompt = () => {
        // term.write('\r\n$ ')
        term.write('$ ')
      }
      term.prompt()
      // canvas背景全屏
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      // fitAddon.fit()
      // window.addEventListener('resize', resizeScreen)
      // // 内容全屏显示
      // function resizeScreen() {
      //   // 不传size
      //   try {
      //     // fitAddon.fit()
      //     // 窗口大小改变时触发xterm的resize方法，向后端发送行列数，格式由后端决定
      //     // 这里不使用size默认参数，因为改变窗口大小只会改变size中的列数而不能改变行数，所以这里不使用size.clos,而直接使用获取我们根据窗口大小计算出来的行列数
      //     // term.onResize(() => {
      //     //   client.sendClientData({ Op: 'resize', Cols: term.cols, Rows: term.rows })
      //     // })
      //   } catch (e) {
      //     console.log('e', e.message)
      //   }
      // }

      function runFakeTerminal(_this) {
        if (term._initialized) {
          return
        }
        // 初始化
        term._initialized = true

        term.writeln(`Welcome to use \x1B[1;3;31m${_this.termName} \x1B[0m. `)

        term.prompt()
        //执行连接操作
        client.connect({
          onError: function(error) {
            //连接失败回调
            term.write('Error: ' + error + '\r\n')
          },
          onConnect: function() {
            //连接成功回调
            _this.handleConnect(_this.termData)
          },
          onClose: function() {
            //连接关闭回调
            term.write('\r\n')
            term.write('connection closed')
            term.write('\r\n')
          },
          onData: function(data) {
            //收到数据时回调
            term.write(data)
            if (data === 'exit') {
              term.write('\r\n')
            }
          }
        }, uuid)
        // / **
        //     *添加事件监听器，用于按下键时的事件。事件值包含
        //     *将在data事件以及DOM事件中发送的字符串
        //     *触发了它。
        //     * @返回一个IDisposable停止监听。
        //  * /
        //   / ** 更新：xterm 4.x（新增）
        //  *为数据事件触发时添加事件侦听器。发生这种情况
        //  *用户输入或粘贴到终端时的示例。事件值
        //  *是`string`结果的结果，在典型的设置中，应该通过
        //  *到支持pty。
        //  * @返回一个IDisposable停止监听。
        //  * /
        // 支持输入与粘贴方法
        term.onData(function(data) {
          client.sendClientData(data, uuid)
        })

        _this.term = term
      }
      runFakeTerminal(_this)
    },
    handleConnect(values) {
      if (values && values.ip && values.port && values.username && values.password) {
        const params = {
          host: values.ip,
          port: values.port,
          username: values.username,
          password: values.password,
          operate: 'connect'
        }
        //在页面上显示连接中...
        this.term.writeln(`Connecting to ${values.ip}:${values.port}...\r\n`)
        client.sendInitData(params, this.uuid)
      }
    },
    handleSend(data) {
      client.sendClientData(data, this.uuid)
    },
    handleClose() {
      // client.close()
      this.term.write('\r\n')
      this.term.writeln(`exiting...`)
      client.sendClientData('exit', this.uuid)
    }
  }
}
</script>
<style lang="less">
#terminal {
  transition: all 0.4s ease 0s;
  position: relative;
  overflow: hidden;
  padding: 8px 0;
}
#terminal .xterm-viewport::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

#terminal .xterm-viewport::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}
#terminal .xterm-viewport::-webkit-scrollbar-corner {
  background: #fff;
}
#terminal .xterm-viewport::-webkit-scrollbar-track {
  background-color: transparent;
}

#terminal .xterm-viewport::-o-scrollbar {
  width: 4px;
  height: 4px;
}
#terminal .xterm-viewport::-o-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}
#terminal .xterm-viewport::-o-scrollbar-corner {
  background: #fff;
}
#terminal .xterm-viewport::-o-scrollbar-track {
  background-color: transparent;
}

#terminal .xterm-viewport::-moz-scrollbar {
  width: 4px;
  height: 4px;
}
#terminal .xterm-viewport::-moz-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}
#terminal .xterm-viewport::-moz-scrollbar-corner {
  background: #fff;
}
#terminal .xterm-viewport::-moz-scrollbar-track {
  background-color: transparent;
}

#terminal .xterm-viewport {
  -ms-scroll-chaining: chained;
  -ms-overflow-style: none;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-type: proximity;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
  -ms-overflow-style: none;
  overflow: auto;
}
.xterm {
  .xterm-screen {
    width: 100% !important;
    padding: 0 8px;
    .xterm-rows {
      div {
        width: 100% !important;
      }
    }
  }
}
</style>
