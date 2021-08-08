import Node from "../classes/Node.mjs"
import { canvas, context, zoom, centre } from "./world.mjs"
import * as mouse from "../events/mouse.mjs"
import { GRID_STEP } from "../settings/application.mjs"
import { SNAP_NODES } from "../settings/user.mjs"
import { connectionArray, connectFromNode, setConnectFromNode } from "./connections.mjs"
import bubble from "./shapes/bubble.mjs"
import { BUBBLE_HEIGHT } from "./shapes/bubble.mjs"
import { BUBBLE_ARROW } from "./shapes/bubble.mjs"
import { BUBBLE_WIDTH } from "./shapes/bubble.mjs"

export let hoveringOverNode = null
export let selectedNode = null

const NODE_RADIUS = GRID_STEP * 0.5
const NODE_OUTLINE_WIDTH = 5

let nodeArray = []

function drawNode(node) {
  context.beginPath()
  context.arc(node.x * zoom + centre.x, node.y * zoom + centre.y, NODE_RADIUS * zoom, 0, 2 * Math.PI, false)
  context.fillStyle = nodeIsHighlighted(node) ? 'white' : node.fill
  context.fill()
  context.lineWidth = NODE_OUTLINE_WIDTH * zoom
  context.strokeStyle = nodeIsHighlighted(node) ? 'black' : node.outline
  context.stroke()

  context.fillStyle = "black"
  context.textBaseline = "middle";
  context.fillText("s" + node.id, node.x * zoom + centre.x, node.y * zoom + centre.y);
}

const BUBBLE_OUTLINE_WIDTH = 3
function drawBubble(x, y) {
  y = y - NODE_RADIUS * zoom - NODE_OUTLINE_WIDTH / 2 * zoom - BUBBLE_HEIGHT * zoom - BUBBLE_ARROW * zoom
  x = x - BUBBLE_WIDTH / 2 * zoom
  context.strokeStyle = "none"
  context.fillStyle = "rgba(0, 0, 0, 0.5)"
  const bubbleClone = new Path2D(bubble)
  context.setTransform(zoom, 0, 0, zoom, x, y);
  context.fill(bubbleClone)
  context.setTransform(1, 0, 0, 1, 0, 0);
}

function drawActions() {
  if (!selectedNode) {
    return
  }
  drawBubble(selectedNode.x * zoom + centre.x, selectedNode.y * zoom + centre.y)
}

export function draw() {
  context.font = `${NODE_RADIUS * zoom}px Arial`
  context.textAlign = "center"
  nodeArray.forEach(node => {
    drawNode(node)
  })
  drawActions()
}

function nodeIsHighlighted(node) {
  return node === hoveringOverNode
    || node === selectedNode
}

function snapNodePositionIfEnabled(x, y) {
  if (SNAP_NODES) {
    x = Math.round(x / GRID_STEP) * GRID_STEP
    y = Math.round(y / GRID_STEP) * GRID_STEP
  }
  return [x, y]
}

function createNode() {
  if (!selectedNode && !hoveringOverNode && !mouse.hasMovedSinceDown) {
    const [x, y] = snapNodePositionIfEnabled((mouse.x - centre.x) / zoom, (mouse.y - centre.y) / zoom)
    nodeArray.push(new Node(x, y))
  }
}

let hasMouseLeftNode = false
function whichNodeIsMouseHoveringOver() {
  canvas.style.cursor = 'default'
  hoveringOverNode = null
  nodeArray.forEach(node => {
    const mouseX = Math.round((mouse.x - centre.x) / zoom)
    const mouseY = Math.round((mouse.y - centre.y) / zoom)

    const distanceSquared = (mouseX - node.x) * (mouseX - node.x) + (mouseY - node.y) * (mouseY - node.y)
    if (distanceSquared <= NODE_RADIUS * NODE_RADIUS) {
      canvas.style.cursor = 'pointer'
      hoveringOverNode = node
    }
  })
  if (!hasMouseLeftNode && !hoveringOverNode) {
    hasMouseLeftNode = true
  }
}

function startConnecting() {
  if (!connectFromNode && hoveringOverNode) {
    hasMouseLeftNode = false
    setConnectFromNode(hoveringOverNode)
  }
}

function finishConnecting() {
  if (!connectFromNode) {
    return
  }
  if (!hoveringOverNode || !hasMouseLeftNode) {
    setConnectFromNode(null)
    return
  }
  if (!connectionArray[connectFromNode.id]) {
    connectionArray[connectFromNode.id] = connectFromNode
  }
  connectionArray[connectFromNode.id][hoveringOverNode.id] = hoveringOverNode
  setConnectFromNode(null)
}

function selectNode() {
  if (hoveringOverNode && !hasMouseLeftNode) {
    selectedNode = hoveringOverNode
  }
}

function deselectNode() {
  if (!hoveringOverNode) {
    selectedNode = null
  }
}

document.getElementById("SNAP_EXISTING_NODES").addEventListener("click", () => {
  nodeArray.forEach(node => {
    [node.x, node.y] = snapNodePositionIfEnabled(node.x, node.y)
  })
})

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, createNode)
mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, deselectNode)
mouse.subscribe(mouse.EVENT_TYPE.MOVE, whichNodeIsMouseHoveringOver)
mouse.subscribe(mouse.EVENT_TYPE.DOWN_LEFT, startConnecting)
mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, finishConnecting)
mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, selectNode)
