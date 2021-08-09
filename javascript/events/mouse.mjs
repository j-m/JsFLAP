import { canvas } from "../draw/world.mjs"
import { INVERT_SCROLL } from "../settings/user.mjs"

export let EVENT_TYPE = {
  MOVE: "move",
  DOWN: "down",
  DOWN_LEFT: "downLeft",
  DOWN_MIDDLE: "downMiddle",
  DOWN_RIGHT: "downRight",
  DOWN_OTHER: "downOther",
  UP: "up",
  UP_LEFT: "upLeft",
  UP_MIDDLE: "upMiddle",
  UP_RIGHT: "upRight",
  UP_OTHER: "upOther",
  SCROLL: "scroll",
  SCROLL_IN: "scrollIn",
  SCROLL_OUT: "scrollOut"
}

export let x = 0
export let y = 0
export let hasMovedSinceDown = false

export let subscriptions = {
  move: [],
  down: [],
  downLeft: [],
  downMiddle: [],
  downRight: [],
  downOther: [],
  up: [],
  upLeft: [],
  upMiddle: [],
  upRight: [],
  upOther: [],
  scroll: [],
  scrollIn: [],
  scrollOut: []
}

export function subscribe(type, func) {
  if (subscriptions[type]) {
    subscriptions[type].push(func)
  } else {
    throw "BAD_CODE: Use the mouse.EVENT_TYPE enum"
  }
}

export function initialise() {
  canvas.onmousedown = down
  canvas.onmousemove = move
  canvas.onmouseup = up
  canvas.onwheel = scroll
  canvas.oncontextmenu = contextMenu
}

function trigger(type) {
  if (subscriptions[type]) {
    for (const subscription of subscriptions[type]) {
      subscription()
    }
  } else {
    throw "BAD_CODE: Use the mouse.EVENT_TYPE enum"
  }
}

function contextMenu(event) {
  move(event)
  event.preventDefault()
  event.stopPropagation()
  return false
}

function move(event) {
  event.preventDefault()
  event.stopPropagation()
  canvas.style.cursor = 'default'
  const canvasRect = canvas.getBoundingClientRect()
  if (x !== event.x - canvasRect.x
    && y !== event.y - canvasRect.y) {
    hasMovedSinceDown = true
  }
  x = event.x - canvasRect.x
  y = event.y - canvasRect.y
  trigger(EVENT_TYPE.MOVE)
}

function down(event) {
  event.preventDefault()
  event.stopPropagation()
  hasMovedSinceDown = false
  switch (event.which) {
    case 1:
      trigger(EVENT_TYPE.DOWN_LEFT)
      break
    case 2:
      trigger(EVENT_TYPE.DOWN_MIDDLE)
      break
    case 3:
      trigger(EVENT_TYPE.DOWN_RIGHT)
      break
    default:
      trigger(EVENT_TYPE.DOWN_OTHER)
  }
  trigger(EVENT_TYPE.DOWN)
  move(event)
}

function up(event) {
  event.preventDefault()
  event.stopPropagation()
  switch (event.which) {
    case 1:
      trigger(EVENT_TYPE.UP_LEFT)
      break
    case 2:
      trigger(EVENT_TYPE.UP_MIDDLE)
      break
    case 3:
      trigger(EVENT_TYPE.UP_RIGHT)
      break
    default:
      trigger(EVENT_TYPE.UP_OTHER)
  }
  trigger(EVENT_TYPE.UP)
  move(event)
}

function scroll(event) {
  event.preventDefault()
  event.stopPropagation()
  hasMovedSinceDown = true
  if (event.deltaY < 0) {
    trigger(INVERT_SCROLL ? EVENT_TYPE.SCROLL_OUT : EVENT_TYPE.SCROLL_IN)
  }
  if (event.deltaY > 0) {
    trigger(INVERT_SCROLL ? EVENT_TYPE.SCROLL_IN : EVENT_TYPE.SCROLL_OUT)
  }
  trigger(EVENT_TYPE.SCROLL)
  move(event)
}
