"use strict"

const { createMacro } = require("babel-plugin-macros")
const tw = require("./tw")

const attributeStringValue = (node) => {
  const nodeValue = node.value
  const expressionValue =
    nodeValue.expression &&
    nodeValue.expression.type === "StringLiteral" &&
    nodeValue.expression.value

  return expressionValue || nodeValue.value || ""
}

const handleTwProperty = ({ path, t, state }) => {
  if (path.node.name.name !== "tw") return

  const twValue = attributeStringValue(path.node)

  const jsxPath = path.findParent((p) => p.isJSXOpeningElement())
  const attributes = jsxPath.get("attributes")
  const classNameAttributes = attributes.filter(
    (p) => p.node.name && p.node.name.name === "className"
  )

  if (classNameAttributes.length > 0) {
    path.remove()
    const classNamePath = classNameAttributes[0]

    let classNamesNode

    if (
      classNamePath.node.value.type === "JSXExpressionContainer" &&
      classNamePath.node.value.expression.type !== "StringLiteral"
    ) {
      const classNameExpression = classNamePath.node.value.expression
      const twValueNode = astify(twValue, t)

      // className={[className, twValue].filter(Boolean).join(" ")}
      classNamesNode = t.jsxExpressionContainer(
        t.callExpression(
          t.memberExpression(
            t.callExpression(
              t.memberExpression(
                t.arrayExpression([classNameExpression, twValueNode]),
                t.identifier("filter")
              ),
              [t.identifier("Boolean")]
            ),
            t.identifier("join")
          ),
          [t.stringLiteral(" ")]
        )
      )
    } else {
      const classNameValue = attributeStringValue(classNamePath.node)
      const classNames = tw(classNameValue, twValue)

      // className="class-name tw-value"
      classNamesNode = astify(classNames, t)
    }

    classNamePath.get("value").replaceWith(classNamesNode)
  } else {
    const classNames = tw(twValue)
    const classNamesNode = astify(classNames, t)

    path.replaceWith(
      t.jsxAttribute(t.jsxIdentifier("className"), classNamesNode)
    )
  }
}

const twMacro = ({ babel: { types: t }, references, state, config }) => {
  const program = state.file.path

  program.traverse({
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
