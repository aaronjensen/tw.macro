const { cond, flatten, map, pipe, prop, propEq } = require("ramda")

const getSelectorsFromNode = cond([
  [propEq("type", "rule"), prop("selector")],
  [propEq("type", "atrule"), (root) => getSelectorsFromRoot(root)],
])

const getSelectorsFromRoot = pipe(
  prop("nodes"),
  map(getSelectorsFromNode),
  flatten
)

const getSelectors = pipe(prop("root"), getSelectorsFromRoot)

module.exports.getSelectors = getSelectors
