"use strict"

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

module.exports.astify = astify
