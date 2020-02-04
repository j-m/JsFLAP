export let INVERT_SCROLL = false
export let SHOW_CENTRE = false
export let NODE_OVERLAP = false
export let SNAP_NODES = false

document.getElementById("INVERT_SCROLL").addEventListener('change', () => { INVERT_SCROLL = document.getElementById("INVERT_SCROLL").checked })
document.getElementById("SHOW_CENTRE").addEventListener('change', () => { SHOW_CENTRE = document.getElementById("SHOW_CENTRE").checked })
document.getElementById("NODE_OVERLAP").addEventListener('change', () => { NODE_OVERLAP = document.getElementById("NODE_OVERLAP").checked })
document.getElementById("SNAP_NODES").addEventListener('change', () => { SNAP_NODES = document.getElementById("SNAP_NODES").checked })
