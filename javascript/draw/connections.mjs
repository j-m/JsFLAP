import { context, centre, zoom } from "./world.mjs"
import { hoveringOverNode } from "./nodes.mjs"
import * as mouse from "../events/mouse.mjs"

let connectionArray = {}

export let nodeOne 
export let nodeTwo
export let downOnNode = false

const ARROW_SIZE = 10
const HANDLE_SIZE = 50

function drawArrow(x, y, angle) {
  context.moveTo(x, y)
  context.lineTo(x - ARROW_SIZE * zoom * Math.cos(angle - Math.PI / 6), y - ARROW_SIZE * zoom * Math.sin(angle - Math.PI / 6))
  context.moveTo(x, y)
  context.lineTo(x - ARROW_SIZE * zoom * Math.cos(angle + Math.PI / 6), y - ARROW_SIZE * zoom * Math.sin(angle + Math.PI / 6))
}

export function draw() {
  context.strokeStyle = 'black'
  context.lineWidth = '2'
  context.beginPath()

  for (let fromNode in connectionArray) {
    for (let toNode in connectionArray[fromNode]) {
      const startX = connectionArray[fromNode].x * zoom + centre.x
      const startY = connectionArray[fromNode].y * zoom + centre.y
      
      const endX = connectionArray[fromNode][toNode].x * zoom + centre.x
      const endY = connectionArray[fromNode][toNode].y * zoom + centre.y
      
      const midX = startX + (endX - startX) / 2
      const midY = startY + (endY - startY) / 2
      
      const deltaX = endX - startX
      const deltaY = endY - startY
      
      const angle = Math.atan2(deltaY, deltaX)
            
      context.moveTo(startX, startY)
      if (connectionArray[toNode] && connectionArray[toNode][fromNode]) {
        const perpendicularAngle = Math.atan2(-deltaX, deltaY)
        const handleX = HANDLE_SIZE * zoom * Math.cos(perpendicularAngle)
        const handleY = HANDLE_SIZE * zoom * Math.sin(perpendicularAngle)
      
        context.moveTo(startX, startY)
        context.quadraticCurveTo(midX + handleX, midY + handleY, endX, endY)
        
        drawArrow(midX + handleX / 2, midY + handleY / 2, angle)
      } else {
        context.moveTo(startX, startY)
        context.lineTo(endX, endY)
        drawArrow(midX, midY, angle)
      }
    }  
  }
  if (nodeOne && !nodeTwo) {
    context.moveTo(nodeOne.x * zoom + centre.x, nodeOne.y * zoom + centre.y)
    context.lineTo(mouse.x, mouse.y) 
  }
  context.stroke()
}

mouse.subscribe(mouse.EVENT_TYPE.UP_LEFT, () => {
  if (!hoveringOverNode) {
    
  }
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
