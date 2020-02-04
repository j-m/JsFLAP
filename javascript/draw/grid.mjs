import { context, zoom } from "./world.mjs"

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800

let centre = { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2 }
let step = 50

function drawVerticalLines() {
  for (let x = centre.x; x > 0; x -= step * zoom) {
    context.moveTo(x, 0)
    context.lineTo(x, CANVAS_HEIGHT)  
  }
  for (let x = centre.x + step * zoom; x < CANVAS_WIDTH; x += step * zoom) {
    context.moveTo(x, 0)
    context.lineTo(x, CANVAS_HEIGHT)  
  }
}

function drawHorizontalLines() {
  for (let y = centre.y; y > 0; y -= step * zoom) {
    context.moveTo(0, y)
    context.lineTo(CANVAS_WIDTH, y)  
  }
  for (let y = centre.y + step * zoom; y < CANVAS_HEIGHT; y += step * zoom) {
    context.moveTo(0, y)
    context.lineTo(CANVAS_WIDTH, y)  
  }
}

export function draw() {
  context.strokeStyle = 'lightgrey'
  context.lineWidth = '1'
  
  context.beginPath()
  drawVerticalLines()
  drawHorizontalLines()
  context.stroke()
}
