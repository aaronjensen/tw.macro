const pluginTester = require("babel-plugin-tester").default
const plugin = require("babel-plugin-macros")
require("../macro")

pluginTester({
  plugin,
  pluginName: "tw.macro",
  babelOptions: {
    filename: __filename,
    babelrc: true,
  },
  tests: [
    {
      code: `
        import "../macro"
        const SomeComponent = <div tw=" some-class  some-other-class " />
      `,
      output: `const SomeComponent = <div className="some-class some-other-class" />`,
    },
  ],
})
