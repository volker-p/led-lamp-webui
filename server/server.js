const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const effects = require('../public/effects')
// Spinning the http server and the websocket server.

const requestHandler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  console.log(req.method, req.url)
  if (req.method === 'GET' && req.url === '/plugins') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(['plugin_a.bin', 'plugin_b.bin']))
    return
  }
  if (req.method === 'DELETE' && req.url.startsWith('/plugin/')) {
    res.writeHead(200)
    res.end('ok')
    return
  }
  if (req.method === 'POST' && req.url === '/uploadPluginSize') {
    let body = ''
    req.on('data', (chunk) => { body += chunk.toString() })
    req.on('end', () => { res.end('ok') })
    return
  }
  if (req.method === 'POST' && req.url === '/uploadPlugin') {
    req.on('data', () => {})
    req.on('end', () => { res.end('ok') })
    return
  }
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString() // convert Buffer to string
  })
  req.on('end', () => {
    res.end('ok')
  })
}

const server = http.createServer(requestHandler)
server.listen(webSocketsServerPort)
const wsServer = new webSocketServer({
  httpServer: server,
})

var state = {
  working: true,
  activeEffect: 0,
  effects,
  alarms: [],
}

const sendState = (connection) => {
  connection.sendUTF(JSON.stringify(state))
}

const updateEffects = (data) => {
  const array = state.effects.map((item, _) => {
    if (data.name == item.name) {
      return data
    }
    return item
  })
  state.effects = array
}

const updateWorking = (status) => {
  state.working = status
}

const updateActiveEffect = (status) => {
  state.activeEffect = status
}

const installPlugins = () => {}

const EVENTS = {
  EFFECTS_CHANGED: updateEffects,
  ALARMS_CHANGED: '',
  WORKING: updateWorking,
  ACTIVE_EFFECT: updateActiveEffect,
  INSTALL_PLUGINS: installPlugins,
}

wsServer.on('request', function (request) {
  console.log(
    new Date() +
      ' Recieved a new connection from origin ' +
      request.origin +
      '.'
  )
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin)
  sendState(connection)
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log(message)
      const data = JSON.parse(message.utf8Data)
      EVENTS[data.event](data.data)
      sendState(connection)
    }
  })
  // user disconnected
  connection.on('close', function (connection) {
    console.log(new Date() + ' Peer disconnected.')
  })
})
