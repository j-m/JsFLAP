import Node from "../classes/Node.mjs"
import { context, zoom } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"

let nodeRadius = 30
let nodeArray = []

function drawNode(node) {
  context.beginPath()
  context.arc(node.x, node.y, nodeRadius * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = 'green'
  context.fill()
  context.lineWidth = 5
  context.strokeStyle = '#003300'
  context.stroke()
}

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  nodeArray.push(new Node(mouse.x, mouse.y))
})

export function draw() {
  nodeArray.forEach(node => {
    drawNode(node)
  })
}
