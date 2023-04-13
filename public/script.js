// Variables globals
var cnv = null
var ctx = null
var isDragging = false
var poligons = []
var newPoligon = null
var selectedColor = "black"
var colorsList = [ "pink", "purple", "red",  "orange",  "yellow",  "lime",  "green",  "cyan",  "blue",  "navy",  "black"];
var selectorSize = 32
var lastX = -1
var lastY = -1

// Iniciar l'aplicació
window.addEventListener('load', init);
function init () {

    // Assignar un nom d'usuari a partir de la llista d'animals
    initNames()

    // Iniciar el canvas
    cnv = document.getElementById("cnv")
    ctx = cnv.getContext("2d")
    resizeCanvas()

    // Iniciar els listeners
    cnv.addEventListener("mousedown", startDragging)
    cnv.addEventListener("touchstart", startDragging)
    cnv.addEventListener("mousemove", doDragging)
    cnv.addEventListener("touchmove", doDragging)
    cnv.addEventListener("mouseup", stopDragging)
    cnv.addEventListener("touchend", stopDragging)
    window.addEventListener('resize', resizeCanvas, false)

    // Iniciar el bucle principal
    requestAnimationFrame(gameLoop)
}

// Definir què passa quan rebem un missatge per WebSocket
var wsOnMessage = (event) => {
    var obj = JSON.parse(event.data)
    if (obj.type == "poligons") {
        poligons = obj.value
    }

}

var run = () => {

    // Neteja el canvas
    ctx.clearRect(0, 0, cnv.width, cnv.height)

    // Dibuixa els polígons de la llista
    drawPoligons(poligons)

    // Si estem dibuixant un polígon, el dibuixa
    if (isDragging) {
        drawPoligon(newPoligon)
    }

    // Dibuixa la graella de colors
    drawColorGrid()
    drawSelectedColor()
}

function drawPoligons (poligons) {

    // Surt si no hi ha res a dibuixar
    let lastPoligon = poligons[poligons.length - 1]
    if (!lastPoligon || lastPoligon.length < 0) {
        return;
    }

    // Dibuixa els polígons
    for (let i = 0; i < poligons.length; i++) {
        var poligon = poligons[i];
        drawPoligon(poligon);
    }
}

function drawPoligon (poligon) {
    
    // Dibuixa un quadre amb el nom d'usuari a la posició del primer punt
    ctx.strokeStyle = poligon.color
    let userTextWidth = ctx.measureText(poligon.user).width
    ctx.fillStyle = poligon.color
    ctx.fillRect(poligon.points[0].x, poligon.points[0].y, userTextWidth + 10, 20)

    // Dibuixar el text en negre o blanc
    if (["purple", "green", "blue", "navy", "black"].indexOf(poligon.color) != -1) {
        ctx.fillStyle = "white"
    } else {
        ctx.fillStyle = "black"
    }
    ctx.fillText(poligon.user, poligon.points[0].x + 5, poligon.points[0].y + 15)

    // Dibuixa el polígon
    ctx.beginPath()
    ctx.moveTo(poligon.points[0].x, poligon.points[0].y)
    for (let i = 1; i < poligon.points.length; i++) {
        ctx.lineTo(poligon.points[i].x, poligon.points[i].y)
    }
    ctx.stroke()
}

function drawColorGrid () {
    let size = selectorSize
    let x = 0
    let y = 0
    for (let i = 0; i < colorsList.length; i++) {
        ctx.fillStyle = colorsList[i]
        ctx.fillRect(x, y, size, size)
        x += size
    }
}

function drawSelectedColor () {
    // Dibuixa un cercle blanc a sobre del color seleccionat
    let size = selectorSize
    let radius = size / 3
    let x = colorsList.indexOf(selectedColor) * size
    let y = 0
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(x + size / 2, y + size / 2, radius, 0, 2 * Math.PI)
    ctx.fill()
}

function resizeCanvas () {
    cnv.width = window.innerWidth
    cnv.height = window.innerHeight
    console.log("Canvas resized to: " + cnv.width + "x" + cnv.height)
}

// Funció que es crida quan s'inicia el 'drag'
function startDragging(event) {

    event.preventDefault()

    let name = document.getElementById("names").value;
    let x = event.clientX || event.touches[0].clientX
    let y = event.clientY || event.touches[0].clientY
    lastX = x
    lastY = y

    isDragging = true;
    newPoligon = {
        user: name,
        color: selectedColor,
        points: [{x: x, y: y}]
    }
}

// Funció que es crida quan es mou el ratolí o el dit durant el 'drag'
function doDragging(event) {

  if (isDragging) {
    let x = event.clientX || event.touches[0].clientX
    let y = event.clientY || event.touches[0].clientY
    lastX = x
    lastY = y
    newPoligon.points.push({x: x, y: y})
  }
}

// Funció que es crida quan s'acaba el 'drag'
function stopDragging(event) {

    // Si no estem fent dragging, potser estem canviant de color
    let size = selectorSize
    let x = lastX
    let y = lastY

    let colorIndex = Math.floor(x / size)
    if (y < size && colorIndex >= 0 && colorIndex < colorsList.length) {
        selectedColor = colorsList[colorIndex]
    }

    // Indicar que ja no estem fent dragging
    isDragging = false;

    // Enviar la nostra llista de polígons per WebSocket
    sendWebSocket({ type: "poligon", value: newPoligon });
}

function reset () {
    sendWebSocket({ type: "reset" });
}



