import { context, centre, zoom } from "./world.mjs"
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_STEP } from "../settings/application.mjs"
import * as mouse from "../events/mouse.mjs"
import { SHOW_CENTRE } from "../settings/user.mjs"

function drawVerticalLines() {
  for (let x = centre.x; x > 0; x -= GRID_STEP * zoom) {
    context.moveTo(x, 0)
    context.lineTo(x, CANVAS_HEIGHT)  
  }
  for (let x = centre.x + GRID_STEP * zoom; x < CANVAS_WIDTH; x += GRID_STEP * zoom) {
    context.moveTo(x, 0)
    context.lineTo(x, CANVAS_HEIGHT)  
  }
}

function drawHorizontalLines() {
  for (let y = centre.y; y > 0; y -= GRID_STEP * zoom) {
    context.moveTo(0, y)
    context.lineTo(CANVAS_WIDTH, y)  
  }
  for (let y = centre.y + GRID_STEP * zoom; y < CANVAS_HEIGHT; y += GRID_STEP * zoom) {
    context.moveTo(0, y)
    context.lineTo(CANVAS_WIDTH, y)  
  }
}

function drawLines() {
  context.strokeStyle = 'lightgrey'
  context.lineWidth = '1'
  
  context.beginPath()
  drawVerticalLines()
  drawHorizontalLines()
  context.stroke()
}

function markCentre() {
  context.beginPath()
  context.arc(centre.x, centre.y, 5*zoom, 0, 2 * Math.PI, false)
  context.fillStyle = 'red'
  context.fill()
  context.lineWidth = 1
  context.strokeStyle = 'black'
  context.stroke()
}

export function draw() {
  drawLines()
  if (SHOW_CENTRE) {
    markCentre()
  }
}

let dragging = false
let previousCentre = {}
let dragFrom = {}

mouse.subscribe(mouse.EVENT_TYPE.DOWN_RIGHT, () => {
  dragging = true
  dragFrom = { x: mouse.x, y: mouse.y }
  previousCentre = { x: centre.x, y: centre.y }
})

mouse.subscribe(mouse.EVENT_TYPE.MOVE, () => {
  if (dragging) {
    centre.x = previousCentre.x + (mouse.x - dragFrom.x) * zoom
    centre.y = previousCentre.y + (mouse.y - dragFrom.y) * zoom
  }
})

mouse.subscribe(mouse.EVENT_TYPE.UP_RIGHT, () => {
  dragging = false
})