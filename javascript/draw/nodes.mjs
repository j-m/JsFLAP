import Node from "../classes/Node.mjs"
import { context, zoom, centre } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { step } from "./grid.mjs"
import { SNAP_NODES } from "../settings/user.mjs"

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
  const [x, y] = nodePosition((mouse.x - centre.x) / zoom, (mouse.y - centre.y) / zoom)
  nodeArray.push(new Node(x, y))
})

function nodePosition(x, y) {
  if (SNAP_NODES) {
    x = Math.round(x / step) * step
    y = Math.round(y / step) * step
  }
  return [x, y]
}

document.getElementById("SNAP_EXISTING_NODES").addEventListener("click",()=>{
  nodeArray.forEach(node => {
    [node.x, node.y] = nodePosition(node.x,node.y)
  })  
})

export function draw() {
  nodeArray.forEach(node => {
    drawNode(node)
  })
}
