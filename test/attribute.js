const pluginTester = require("babel-plugin-tester").default
const plugin = require("babel-plugin-macros")
require("../macro")

const addImport = ({ code, ...rest }) => ({
  code: `import "../macro"
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
      title: "String literal",
      code: `const SomeComponent = <div tw=" some-class
 some-other-class " />`,
      output: `const SomeComponent = <div className="some-class some-other-class" />`,
    },
    {
      title: "String expression",
      code: `const SomeComponent = <div tw={" some-class  some-other-class "} />`,
      output: `const SomeComponent = <div className="some-class some-other-class" />`,
    },
    {
      title: "Combined with className",
      code: `const SomeComponent = <div className="some-class" tw="some-other-class" />`,
      output: `const SomeComponent = <div className="some-class some-other-class" />`,
    },
  ].map(addImport),
})
