import { subscribe, EVENT_TYPE, x as mouseX, y as mouseY } from "../events/mouse.mjs"
import { CANVAS_WIDTH, CANVAS_HEIGHT, ZOOM_STEP } from "../settings/application.mjs"
import { draw as gridDraw } from "./grid.mjs"
import { draw as connectionsDraw } from "./connections.mjs"
import { draw as nodesDraw } from "./nodes.mjs"

export let canvas
export let context
export let zoom = 1
export let centre = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }

export function initialise() {
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  draw()
}

export function draw() {
  requestAnimationFrame(draw)
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  gridDraw()
  connectionsDraw()
  nodesDraw()
}

export function zoomIn() {
  if (zoom < 2 - ZOOM_STEP) {
    const zoomDifference = (zoom + ZOOM_STEP) / zoom
    centre.x = mouse.x - (mouse.x - centre.x) * zoomDifference
    centre.y = mouse.y - (mouse.y - centre.y) * zoomDifference
    zoom += ZOOM_STEP
  }
}

export function zoomOut() {
  if (zoom > ZOOM_STEP + 0.1) {
    const zoomDifference = (zoom - ZOOM_STEP) / zoom
    centre.x = mouse.x - (mouse.x - centre.x) * zoomDifference
    centre.y = mouse.y - (mouse.y - centre.y) * zoomDifference
    zoom -= ZOOM_STEP
  }
}

export const mouse = { x: 0, y: 0 }
export function onMouseMove() {
  mouse.x = Math.round((mouseX - centre.x) / zoom)
  mouse.y = Math.round((mouseY - centre.y) / zoom)
}

subscribe(EVENT_TYPE.SCROLL_IN, zoomIn)
subscribe(EVENT_TYPE.SCROLL_OUT, zoomOut)
subscribe(EVENT_TYPE.MOVE, onMouseMove)
