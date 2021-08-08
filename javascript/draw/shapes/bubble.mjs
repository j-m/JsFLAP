export const BUBBLE_WIDTH = 120
export const BUBBLE_HEIGHT = 40
export const BUBBLE_ARROW = 10
export const BUBBLE_RADIUS = 5

const bubble = new Path2D()
export default bubble

const x = BUBBLE_WIDTH / 2
const y = BUBBLE_HEIGHT + BUBBLE_ARROW

bubble.moveTo(x, y)
bubble.lineTo(x + BUBBLE_ARROW, y - BUBBLE_ARROW)
bubble.lineTo(x + BUBBLE_WIDTH / 2 - BUBBLE_RADIUS, y - BUBBLE_ARROW)
bubble.quadraticCurveTo(
  x + BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW,
  x + BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW - BUBBLE_RADIUS
)
bubble.lineTo(x + BUBBLE_WIDTH / 2, y - BUBBLE_ARROW - BUBBLE_HEIGHT + BUBBLE_RADIUS)
bubble.quadraticCurveTo(
  x + BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW - BUBBLE_HEIGHT,
  x + BUBBLE_WIDTH / 2 - BUBBLE_RADIUS,
  y - BUBBLE_ARROW - BUBBLE_HEIGHT
)
bubble.lineTo(x - BUBBLE_WIDTH / 2 + BUBBLE_RADIUS, y - BUBBLE_ARROW - BUBBLE_HEIGHT)
bubble.quadraticCurveTo(
  x - BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW - BUBBLE_HEIGHT,
  x - BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW - BUBBLE_HEIGHT + BUBBLE_RADIUS
)
bubble.lineTo(x - BUBBLE_WIDTH / 2, y - BUBBLE_ARROW - BUBBLE_RADIUS)
bubble.quadraticCurveTo(
  x - BUBBLE_WIDTH / 2,
  y - BUBBLE_ARROW,
  x - BUBBLE_WIDTH / 2 + BUBBLE_RADIUS,
  y - BUBBLE_ARROW
)
bubble.lineTo(x - BUBBLE_ARROW, y - BUBBLE_ARROW)
