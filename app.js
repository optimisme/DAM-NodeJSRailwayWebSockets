const express     = require('express')
const fs          = require('fs').promises

const post        = require('./utilsPost.js')
const wait        = require('./utilsWait.js')
const gameLoop    = require('./utilsGameLoop.js');
const webSockets  = require('./utilsWebSockets.js')

var ws = new webSockets()
var gLoop = new gameLoop()
var poligons = []

// Start HTTP server
const app = express()
const port = process.env.PORT || 8000

// Publish static files from 'public' folder
app.use(express.static('public'))

// Activate HTTP server
const httpServer = app.listen(port, appListen)
function appListen () {
  console.log(`Listening for HTTP queries on: http://localhost:${port}`)
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



function broadcastPoligons () {
  ws.broadcast({ type: "poligons", value: poligons })
}

// Run WebSocket server
ws.init(httpServer, port)

ws.onConnection = (socket, id) => {
  // Aquest mètode es crida quan hi ha una nova connexió WebSocket
  broadcastPoligons()
}

ws.onMessage = (socket, id, obj) => {
  // Aquest mètode es crida quan es rep un missatge per WebSocket
  if (obj.type == "poligon") {

    let receivedPoligon = obj.value;

    const existingPolygonIndex = poligons.findIndex(poligon => {
      return poligon.id === receivedPoligon.id
    });

    if (existingPolygonIndex !== -1) {
      poligons[existingPolygonIndex] = receivedPoligon;
    } else {
      while (poligons.length > 25) {
        poligons.shift();
      }
      poligons.push(receivedPoligon);
    }
  }

  if (obj.type == "reset") {
    poligons = [];
  }
};


gLoop.init();
gLoop.run = (fps) => {
  // Aquest mètode s'intenta executar 30 cops per segon
  broadcastPoligons()
}