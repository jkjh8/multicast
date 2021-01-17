import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import dgram from 'dgram'
import moment from 'moment'
const ipaddress = require('ip')

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
let server

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function onConnect (ip, port) {
  server = dgram.createSocket('udp4')

  server.on('listening', function () {
    const address = server.address();
    console.log('UDP server listening on ' + address.address + ":" + address.port);
  })

  server.on("message", function ( data, rinfo ) {
    console.log("Message received from ", rinfo.address, " : ", data.toString())
    const time = moment().format('LTS')
    const message = {
      createAt: time,
      from: rinfo.address,
      msg: data.toString()
    }
    mainWindow.webContents.send('data', message)
  })
  server.bind(port, '0.0.0.0', () => {
    server.setBroadcast(true)
    server.setMulticastTTL(128)
    server.addMembership(ip)
    console.log(ip)
  })
  console.log('create Server')
}

function disConnect () {
  server.close()
  server = null
}

function sendMsg (ip, port, msg) {
  const socket = dgram.createSocket("udp4")
  const message = new Buffer.from(msg)
  socket.bind(59999, '0.0.0.0', function () {
    socket.setBroadcast(true)
    socket.setMulticastTTL(128)
    socket.addMembership(ip)
    socket.send(message, 0, message.length, port, ip, () => {
      socket.close()
    })
  })
}

ipcMain.on('onConnect', (event, data) => {
  console.log(data)
  onConnect(data.ip, data.port)
})

ipcMain.on('disConnect', (event, data) => {
  console.log(data)
  server.close()
  server = null
})

ipcMain.on('sendMsg', (event, data) => {
  sendMsg(data.ip, data.port, data.msg)
})

ipcMain.on('clear', (event) => {
  event.reply('clear')
})
