import Node from "../classes/Node.mjs"
import { context, zoom } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./settings.mjs"

let nodeRadius = 30
let nodeArray = []

function drawNode(node) {
  context.beginPath()
  context.arc(node.x * zoom + CANVAS_WIDTH/2, node.y * zoom + CANVAS_HEIGHT/2, nodeRadius * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = node.fill
  context.fill()
  context.lineWidth = 5
  context.strokeStyle = node.outline
  context.stroke()
}

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  let x = (mouse.x - CANVAS_WIDTH/2) / zoom
  let y = (mouse.y - CANVAS_HEIGHT/2) / zoom
  nodeArray.push(new Node(x, y))
})

export function draw() {
  nodeArray.forEach(node => {
    drawNode(node)
  })
}
