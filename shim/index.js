var {TouchBar} = require("electron")

function createTouchBar(items) {
    return new TouchBar(items)
}

exports.createTouchBar = createTouchBar