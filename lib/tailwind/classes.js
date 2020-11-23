const { last, map, pipe, replace, split } = require("ramda")

const keepLastPart = pipe(split(" "), last)
const removePseudoElements = replace(/:.*/, "")
const removeSlashs = replace("\\", "")
const removeFirstDot = replace(/^./, "")

const getClasses = map(
  pipe(keepLastPart, removePseudoElements, removeSlashs, removeFirstDot)
)

module.exports.getClasses = getClasses
