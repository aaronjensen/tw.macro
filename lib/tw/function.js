const { removeExtraneousWhitespace } = require("../string")

const handleTwFunction = (references, state, t) => {
  const defaultImportReferences = references.default || references.tw || []
  defaultImportReferences.forEach((path) => {
    const parent = path.findParent((x) => x.isTaggedTemplateExpression())
    if (!parent) return

    const parsed = parseTte({
      path: parent,
      types: t,
      state,
    })

    if (parsed == null) {
      throw new Error(
        `Only plain strings can be used with the "tw" tagged template literal.\nEg: tw\`text-black\``
      )
    }

    const rawClasses = parsed.string
    const twValue = removeExtraneousWhitespace(rawClasses)

    parent.replaceWith(t.stringLiteral(twValue))
  })
}

function parseTte({ path, types: t, state }) {
  if (
    path.node.tag.type !== "Identifier" &&
    path.node.tag.type !== "MemberExpression" &&
    path.node.tag.type !== "CallExpression"
  )
    return null

  const string = path.get("quasi").evaluate().value

  if (string == null) return

  const stringLoc = path.get("quasi").node.loc

  path.node.loc = stringLoc

  return { string, path }
}

module.exports.handleTwFunction = handleTwFunction
