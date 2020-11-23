"use strict"

const { astify } = require("../ast")
const { removeExtraneousWhitespace } = require("../string")

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

  if (!path.node.value) {
    path.remove()
    return
  }

  const twValue = attributeStringValue(path.node)

  if (path.node.value.expression && !twValue) {
    throw new Error(
      `Only plain strings can be used with the "tw" prop.\nEg: <div tw="text-black" /> or <div tw={"text-black"} />`
    )
  }

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
      const classNames = removeExtraneousWhitespace(
        `${classNameValue} ${twValue}`
      )

      // className="class-name tw-value"
      classNamesNode = astify(classNames, t)
    }

    classNamePath.get("value").replaceWith(classNamesNode)
  } else if (twValue) {
    const classNames = removeExtraneousWhitespace(twValue)
    const classNamesNode = astify(classNames, t)

    path.replaceWith(
      t.jsxAttribute(t.jsxIdentifier("className"), classNamesNode)
    )
  } else {
    path.remove()
  }
}

module.exports.handleTwProperty = handleTwProperty
