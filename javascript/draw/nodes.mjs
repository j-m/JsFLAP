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

export function draw() {
  context.font = `${NODE_RADIUS * zoom}px Arial`
  context.textAlign = "center"
  nodeArray.forEach(node => {
    drawNode(node)
  })
}

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
  
  context.fillStyle = "black"
  context.textBaseline = "middle";
  context.fillText("s"+node.id, node.x * zoom + centre.x, node.y * zoom + centre.y);
}

function createNode() {
  if (!hoveringOverNode) {
    const [x, y] = repositionNodes((mouse.x - centre.x) / zoom, (mouse.y - centre.y) / zoom)
    nodeArray.push(new Node(x, y))
  }
}

function whichNodeIsMouseHoveringOver () {
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
}

function repositionNodes(x, y) {
  if (SNAP_NODES) {
    x = Math.round(x / GRID_STEP) * GRID_STEP
    y = Math.round(y / GRID_STEP) * GRID_STEP
  }
  return [x, y]
}

function selectNode() {
  downOnNode = hoveringOverNode
}

function connectNodes() {
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
}

function deselectNode() {
  nodeOne = null
  nodeTwo = null
  document.getElementById("one").disabled = true
  document.getElementById("two").disabled = true
  document.getElementById("connection").disabled = true
}

document.getElementById("SNAP_EXISTING_NODES").addEventListener("click",()=>{
  nodeArray.forEach(node => {
    [node.x, node.y] = repositionNodes(node.x,node.y)
  })  
})

document.getElementById("node1Delete").addEventListener("click",()=>{
  nodeOne = null
})

document.getElementById("node2Delete").addEventListener("click",()=>{
  nodeTwo = null
})

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, createNode)
mouse.subscribe(mouse.EVENT_TYPE.MOVE, whichNodeIsMouseHoveringOver)
mouse.subscribe(mouse.EVENT_TYPE.DOWN_LEFT, selectNode)
mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, connectNodes)
mouse.subscribe(mouse.EVENT_TYPE.UP_RIGHT, deselectNode)

