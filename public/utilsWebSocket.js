// Iniciar el client WebSocket
let locationWebSockets = window.location.origin.replace("http", "ws") // "ws://localhost:8888"
let webSocket;

function initWebSocket () {
    webSocket = new WebSocket(locationWebSockets)
    console.log("WS Connected")
    webSocket.addEventListener('close', () => { 
        console.log("WS Disconnected")
        webSocket.close()
        setTimeout(initWebSocket(), 1000) 
    })
    webSocket.addEventListener('error', (event) => { console.error(event) })
    webSocket.addEventListener('message', (event) => {
        if (wsOnMessage) {
            wsOnMessage(event)
        }
    })
}

initWebSocket()

async function sendWebSocket (obj) {
    webSocket.send(JSON.stringify(obj))
}