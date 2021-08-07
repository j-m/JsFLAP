import { context, centre, zoom } from "./world.mjs"
import { nodeOne, nodeTwo } from "./nodes.mjs"
import * as mouse from "../events/mouse.mjs"

export let connectionArray = {}

const ARROW_SIZE = 10
const HANDLE_SIZE = 50
const SELF_LOOP_SIZE = 100

function drawArrow(x, y, angle) {
  context.moveTo(x, y)
  context.lineTo(x - ARROW_SIZE * zoom * Math.cos(angle - Math.PI / 6), y - ARROW_SIZE * zoom * Math.sin(angle - Math.PI / 6))
  context.moveTo(x, y)
  context.lineTo(x - ARROW_SIZE * zoom * Math.cos(angle + Math.PI / 6), y - ARROW_SIZE * zoom * Math.sin(angle + Math.PI / 6))
}

function drawSelfConnection(fromNode) {
  const startX = connectionArray[fromNode].x * zoom + centre.x
  const startY = connectionArray[fromNode].y * zoom + centre.y

  context.moveTo(startX, startY)
  context.bezierCurveTo(startX - SELF_LOOP_SIZE * zoom, startY - SELF_LOOP_SIZE * zoom, startX + SELF_LOOP_SIZE * zoom, startY - SELF_LOOP_SIZE * zoom, startX, startY);
}

function drawOneWayConnection(fromNode, toNode) {
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
  context.lineTo(endX, endY)
  drawArrow(midX, midY, angle)
}

function drawTwoWayConnection(fromNode, toNode) {
  const startX = connectionArray[fromNode].x * zoom + centre.x
  const startY = connectionArray[fromNode].y * zoom + centre.y

  const endX = connectionArray[fromNode][toNode].x * zoom + centre.x
  const endY = connectionArray[fromNode][toNode].y * zoom + centre.y

  const midX = startX + (endX - startX) / 2
  const midY = startY + (endY - startY) / 2

  const deltaX = endX - startX
  const deltaY = endY - startY

  const angle = Math.atan2(deltaY, deltaX)
  const perpendicularAngle = Math.atan2(-deltaX, deltaY)

  const handleX = HANDLE_SIZE * zoom * Math.cos(perpendicularAngle)
  const handleY = HANDLE_SIZE * zoom * Math.sin(perpendicularAngle)

  context.moveTo(startX, startY)
  context.quadraticCurveTo(midX + handleX, midY + handleY, endX, endY)

  drawArrow(midX + handleX / 2, midY + handleY / 2, angle)
}

function drawConnection(fromNode, toNode) {
  if (fromNode === toNode) {
    drawSelfConnection(fromNode)
  }
  else {
    if (connectionArray[toNode] && connectionArray[toNode][fromNode]) {
      drawTwoWayConnection(fromNode, toNode)
    } else {
      drawOneWayConnection(fromNode, toNode)
    }
  }
}

export function draw() {
  context.strokeStyle = 'black'
  context.lineWidth = '2'
  context.beginPath()

  for (let fromNode in connectionArray) {
    for (let toNode in connectionArray[fromNode]) {
      drawConnection(fromNode, toNode)
    }
  }
  if (nodeOne && !nodeTwo) {
    context.moveTo(nodeOne.x * zoom + centre.x, nodeOne.y * zoom + centre.y)
    context.lineTo(mouse.x, mouse.y)
  }
  context.stroke()
}

