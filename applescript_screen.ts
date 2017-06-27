// Import electron because screen conflicts with builtins.
import * as electron from "electron"

/*
This script fetches information about the screen, and converts it to an
AppleScript object.
*/

// currentDisplay uses the location of the mouse pointer to determine current display.
export function currentDisplay(): string {
    let s = electron.screen
    let cur = s.getDisplayNearestPoint(s.getCursorScreenPoint())
    return toRecord(cur)
}

function toRecord(cur: any): string {
    return `set currentScreen to {bounds: {${cur.bounds.x}, ${cur.bounds.y}, ${cur.bounds.width}, ${cur.bounds.height}}, id: ${cur.id}}`
}