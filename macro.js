"use strict"

const { createMacro } = require("babel-plugin-macros")
const { handleTwProperty } = require("./lib/macro/property")
const { handleTwFunction } = require("./lib/macro/function")

const twMacro = ({ babel: { types: t }, references, state, config }) => {
  const program = state.file.path

  handleTwFunction(references, state, t)

  program.traverse({
    JSXAttribute(path) {
      handleTwProperty({ path, t, state })
    },
  })
}

module.exports = createMacro(twMacro, { configName: "tw" })
