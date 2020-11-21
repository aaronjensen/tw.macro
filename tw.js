"use strict"

const tw = (strings, ...values) => {
  let result = ""

  if (Array.isArray(strings) && "raw" in strings) {
    values = values.flat(Infinity)
    for (let i = 0; i < strings.length; ++i) {
      result += strings[i]
      if (i < values.length && values[i]) {
        result += values[i]
      }
    }
  } else {
    result = [strings, ...values].flat(Infinity).filter(Boolean).join(" ")
  }

  return result.replace(/(\r\n|\n|\r| )+/gm, " ").trim()
}

module.exports = tw
