"use strict"

const removeExtraneousWhitespace = (string) =>
  string.trim().split(/\s+/).join(" ")

module.exports.removeExtraneousWhitespace = removeExtraneousWhitespace
