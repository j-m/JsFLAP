import * as world from "./draw/world.mjs"
import * as mouse from "./events/mouse.mjs"

window.onload = () => {
  world.initialise()
  mouse.initialise()
}
