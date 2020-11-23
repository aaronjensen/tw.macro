"use strict"

const tailwindcss = require("tailwindcss")
const tailwindConfig = require("tailwindcss/defaultConfig")
const postcss = require("postcss")
const { pipe, filter, uniq } = require("ramda")
const { restoreSeparator, withSafeSeparator } = require("./separator")
const { getSelectors } = require("./selectors")
const { getClasses } = require("./classes")

const getClassNames = async () => {
  const config = tailwindcss(tailwindConfig)
  return postcss(withSafeSeparator(config))
    .process("@tailwind utilities;", {
      from: undefined,
    })
    .then(getSelectors)
    .then(getClasses)
    .then(restoreSeparator(config))
    .then(pipe(uniq, filter(Boolean)))
}

module.exports.getClassNames = getClassNames
