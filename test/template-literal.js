const pluginTester = require("babel-plugin-tester").default
const plugin = require("babel-plugin-macros")
require("../macro")

const addImport = ({ code, ...rest }) => ({
  code: `import tw from "../macro"
${code}`,
  ...rest,
})

pluginTester({
  plugin,
  pluginName: "tw.macro",
  babelOptions: {
    filename: __filename,
    babelrc: true,
  },
  tests: [
    {
      title: "Empty string",
      code: `tw\`\``,
      output: `""`,
    },
    {
      title: "String without interpolation",
      code: `tw\` some-class
 some-other-class \``,
      output: `"some-class some-other-class"`,
    },
    {
      title: "String with interpolation",
      code: `const someOtherClass = "some-other-class"
tw\`some-class \${someOtherClass}\``,
      error: true,
    },
  ].map(addImport),
})
