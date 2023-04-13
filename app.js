const express     = require('express')
const fs          = require('fs').promises

const post        = require('./utilsPost.js')
const wait        = require('./utilsWait.js')
const gameLoop    = require('./utilsGameLoop.js');
const webSockets  = require('./utilsWebSockets.js')

var ws = new webSockets()
var gLoop = new gameLoop()

// Start HTTP server
const app = express()
const port = process.env.PORT || 8000

// Publish static files from 'public' folder
app.use(express.static('public'))

// Activate HTTP server
const httpServer = app.listen(port, appListen)
function appListen () {
  console.log(`Listening for HTTP queries on: http://localhost:${port}`)
  gLoop.start();
}

// Close connections when process is killed
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  httpServer.close()
  ws.end()
  gLoop.stop();
  process.exit(0);
}

var poligons = []

function broadcastPoligons () {
  ws.broadcast({ type: "poligons", value: poligons })
}

// Run WebSocket server
ws.init(httpServer, port)

ws.onConnection = (socket, id) => {
  broadcastPoligons()
}

ws.onMessage = (socket, id, obj) => {
   if (obj.type == "poligon") {
    while (poligons.length > 25) {
      poligons.shift();
    }
    poligons.push(obj.value)
  }

  if (obj.type == "reset") {
    poligons = []
  }
  // broadcastPoligons()
}

gLoop.init();
gLoop.run = (fps) => {
  broadcastPoligons()
}