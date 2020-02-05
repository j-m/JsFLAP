let id = 0

export default class Node {
  constructor(x, y) {
    this.id = id++
    this.x = x
    this.y = y
    this.label = ""
    this.state = "inactive"
    this.fill = "aliceblue"
    this.outline = "lightslategrey"
  } 
}
