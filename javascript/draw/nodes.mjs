import Node from "../classes/Node.mjs"
import { canvas, context, zoom, centre } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { GRID_STEP } from "../settings/application.mjs"
import { SNAP_NODES } from "../settings/user.mjs"

let nodeArray = []
let hoveringOverNode = null

function drawNode(node) {
  context.beginPath()
  context.arc(node.x * zoom + centre.x, node.y * zoom + centre.y, GRID_STEP * 0.5 * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = (hoveringOverNode === node) ? 'white' : node.fill
  context.fill()
  context.lineWidth = 5 * zoom
  context.strokeStyle = (hoveringOverNode === node) ? 'black' : node.outline
  context.stroke()
}

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  if (!hoveringOverNode) {
    const [x, y] = nodePosition((mouse.x - centre.x) / zoom, (mouse.y - centre.y) / zoom)
    nodeArray.push(new Node(x, y))
  }
})

mouse.subscribe(mouse.EVENT_TYPE.MOVE, () => {
  canvas.style.cursor = 'default'
  hoveringOverNode = null
  nodeArray.forEach(node => {
    const nodeX = Math.round(node.x / GRID_STEP)
    const nodeY = Math.round(node.y / GRID_STEP)
    
    const mouseX = Math.round((mouse.x - centre.x) / zoom)
    const mouseY = Math.round((mouse.y - centre.y) / zoom)
    
    const distanceSquared = (mouseX- node.x) * (mouseX - node.x) + (mouseY - node.y) * (mouseY - node.y)
    if (distanceSquared <= GRID_STEP * GRID_STEP * 0.25) {
      canvas.style.cursor = 'pointer'
      hoveringOverNode = node
    }
  }) 
})

function nodePosition(x, y) {
  if (SNAP_NODES) {
    x = Math.round(x / GRID_STEP) * GRID_STEP
    y = Math.round(y / GRID_STEP) * GRID_STEP
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
