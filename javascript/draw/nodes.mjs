import Node from "../classes/Node.mjs"
import { context, zoom, centre } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./settings.mjs"

let nodeRadius = 30
let nodeArray = []

function drawNode(node) {
  context.beginPath()
  context.arc(node.x * zoom + centre.x, node.y * zoom + centre.y, nodeRadius * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = node.fill
  context.fill()
  context.lineWidth = 5 * zoom
  context.strokeStyle = node.outline
  context.stroke()
}

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  let x = (mouse.x - centre.x) / zoom
  let y = (mouse.y - centre.y) / zoom
  nodeArray.push(new Node(x, y))
})

export function draw() {
  nodeArray.forEach(node => {
    drawNode(node)
  })
}
