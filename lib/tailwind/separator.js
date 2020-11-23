const { assoc, map, replace } = require("ramda")

/**
 * Because we need something easily replaceable in strings,
 * and that don't conflict with pseudo-selectors and css.
 */
const safeSeparator = "___"

const withSafeSeparator = assoc("separator", safeSeparator)

const restoreSeparator = ({ separator = ":" }) =>
  map(replace(new RegExp(safeSeparator, "g"), separator))

module.exports.withSafeSeparator = withSafeSeparator
module.exports.restoreSeparator = restoreSeparator
