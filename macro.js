"use strict"

const { createMacro } = require("babel-plugin-macros")
const tw = require("./tw")

const handleTwProperty = ({ path, t, state }) => {
  if (path.node.name.name !== "tw") return

  const nodeValue = path.node.value

  const jsxPath = path.findParent((p) => p.isJSXOpeningElement())
  const attributes = jsxPath.get("attributes")
  const classNameAttributes = attributes.filter(
    (p) => p.node.name && p.node.name.name === "className"
  )

  const originalClassNames = nodeValue.value || ""
  const classNames = tw(originalClassNames)
  console.log(classNames)

  const classNamesNode = astify(classNames, t)

  path.replaceWith(t.jsxAttribute(t.jsxIdentifier("className"), classNamesNode))
}

const twMacro = ({ babel: { types: t }, references, state, config }) => {
  const program = state.file.path

  program.traverse({
    // ImportDeclaration(path) {
    //   setStyledIdentifier({ state, path, styledImport })
    //   setCssIdentifier({ state, path, cssImport })
    // },
    JSXAttribute(path) {
      handleTwProperty({ path, t, state })
    },
  })
}

function astify(literal, t) {
  if (literal === null) {
    return t.nullLiteral()
  }

  switch (typeof literal) {
    case "function":
      return t.unaryExpression("void", t.numericLiteral(0), true)
    case "number":
      return t.numericLiteral(literal)
    case "boolean":
      return t.booleanLiteral(literal)
    case "undefined":
      return t.unaryExpression("void", t.numericLiteral(0), true)
    case "string":
      return t.stringLiteral(literal)
    default:
      // TODO: When is the literal an array? It's only an object/string
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map((x) => astify(x, t)))
      }

      // TODO: This is horrible, clean it up
      try {
        return t.objectExpression(
          objectExpressionElements(literal, t, "spreadElement")
        )
      } catch (_) {
        return t.objectExpression(
          objectExpressionElements(literal, t, "spreadProperty")
        )
      }
  }
}

module.exports = createMacro(twMacro, { configName: "tw" })
