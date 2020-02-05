import Node from "../classes/Node.mjs"
import { canvas, context, zoom, centre } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { GRID_STEP } from "../settings/application.mjs"
import { SNAP_NODES } from "../settings/user.mjs"
import { connectionArray } from "./connections.mjs"

export let nodeOne 
export let nodeTwo
export let downOnNode = false
export let hoveringOverNode = null

const NODE_RADIUS = GRID_STEP * 0.5

let nodeArray = []

function nodeIsHighlighted(node) {
  return node === hoveringOverNode
      || node === nodeOne
      || node === nodeTwo
}

function drawNode(node) {
  context.beginPath()
  context.arc(node.x * zoom + centre.x, node.y * zoom + centre.y, NODE_RADIUS * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = nodeIsHighlighted(node) ? 'white' : node.fill
  context.fill()
  context.lineWidth = 5 * zoom
  context.strokeStyle = nodeIsHighlighted(node) ? 'black' : node.outline
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
    const mouseX = Math.round((mouse.x - centre.x) / zoom)
    const mouseY = Math.round((mouse.y - centre.y) / zoom)
    
    const distanceSquared = (mouseX- node.x) * (mouseX - node.x) + (mouseY - node.y) * (mouseY - node.y)
    if (distanceSquared <= NODE_RADIUS * NODE_RADIUS) {
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

document.getElementById("node1Delete").addEventListener("click",()=>{
  nodeOne = null
})

document.getElementById("node2Delete").addEventListener("click",()=>{
  nodeTwo = null
})

mouse.subscribe(mouse.EVENT_TYPE.DOWN_LEFT, () => {
  downOnNode = hoveringOverNode
})

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  if (downOnNode == hoveringOverNode) {
    if (nodeOne) {
      nodeTwo = downOnNode
      document.getElementById("two").disabled = false
      if (!connectionArray[nodeOne.id]) {
        connectionArray[nodeOne.id] = nodeOne
      }
      connectionArray[nodeOne.id][nodeTwo.id] = nodeTwo
      document.getElementById("connection").disabled = false
    } else {
      nodeOne = downOnNode
      document.getElementById("one").disabled = false
    }
  }
  if (nodeTwo) {
    nodeOne = null
    nodeTwo = null
    document.getElementById("one").disabled = true
    document.getElementById("two").disabled = true
    document.getElementById("connection").disabled = true
  }
})

mouse.subscribe(mouse.EVENT_TYPE.UP_RIGHT, () => {
  nodeOne = null
  nodeTwo = null
  document.getElementById("one").disabled = true
  document.getElementById("two").disabled = true
  document.getElementById("connection").disabled = true
})

export function draw() {
  nodeArray.forEach(node => {
    drawNode(node)
  })
}
