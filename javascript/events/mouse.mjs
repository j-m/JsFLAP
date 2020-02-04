import { canvas } from "../draw/world.mjs"

const INVERT_SCROLL = false  // TODO: Let user toggle value

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
  document.onmousedown = down
  document.onmousemove = move
  document.onmouseup = up
  document.onwheel = scroll
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

function move(event) {
  const canvasRect = canvas.getBoundingClientRect()
  x = event.x - canvasRect.x
  y = event.y - canvasRect.y
  trigger(EVENT_TYPE.MOVE)
}

function down(event) {
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
}

function up(event) {
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
}

function scroll(event) {
  if (event.deltaY < 0) {
    trigger(INVERT_SCROLL ? EVENT_TYPE.SCROLL_OUT : EVENT_TYPE.SCROLL_IN)     
  }
  if (event.deltaY > 0) {
    trigger(INVERT_SCROLL ? EVENT_TYPE.SCROLL_IN : EVENT_TYPE.SCROLL_OUT)
  }
  trigger(EVENT_TYPE.SCROLL)
}
