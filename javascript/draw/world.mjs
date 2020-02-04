import * as nodes from "./nodes.mjs"
import * as grid from "./grid.mjs"
import * as mouse from "../events/mouse.mjs"
import { CANVAS_WIDTH, CANVAS_HEIGHT, ZOOM_STEP } from "../settings/application.mjs"

export let canvas
export let context
export let zoom = 1
export let centre = { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2 }

export function initialise() {
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  draw()
}

export function draw() {
  requestAnimationFrame(draw)
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  grid.draw()
  nodes.draw()
}

mouse.subscribe(mouse.EVENT_TYPE.SCROLL_IN, () => {
  if (zoom < 2 - ZOOM_STEP) {
    const zoomDifference = (zoom + ZOOM_STEP) / zoom
    centre.x = mouse.x - (mouse.x - centre.x) * zoomDifference
    centre.y = mouse.y - (mouse.y - centre.y) * zoomDifference
    zoom += ZOOM_STEP
  }
})

mouse.subscribe(mouse.EVENT_TYPE.SCROLL_OUT, () => {
  if (zoom > ZOOM_STEP + 0.1) {
    const zoomDifference = (zoom - ZOOM_STEP) / zoom
    centre.x = mouse.x - (mouse.x - centre.x) * zoomDifference
    centre.y = mouse.y - (mouse.y - centre.y) * zoomDifference
    zoom -= ZOOM_STEP
  }
})
