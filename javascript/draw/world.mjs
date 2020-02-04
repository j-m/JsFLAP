import * as nodes from "./nodes.mjs"
import * as grid from "./grid.mjs"
import * as mouse from "../events/mouse.mjs"

const ZOOM_STEP = 0.05

export let canvas
export let context
export let zoom = 1

export function initialise() {
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  draw()
}

export function draw() {
  requestAnimationFrame(draw)
  context.clearRect(0, 0, window.innerWidth, window.innerHeight)
  grid.draw()
  nodes.draw()
}

mouse.subscribe(mouse.EVENT_TYPE.SCROLL_IN, () => {
  if (zoom < 2 - ZOOM_STEP) {
    zoom += ZOOM_STEP
  }
})

mouse.subscribe(mouse.EVENT_TYPE.SCROLL_OUT, () => {
  if (zoom > ZOOM_STEP + 0.1) {
    zoom -= ZOOM_STEP
  }
})
