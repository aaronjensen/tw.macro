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
      code: `;<div tw=" some-class
 some-other-class " />`,
      output: `;<div className="some-class some-other-class" />`,
    },
    {
      title: "String expression",
      code: `;<div tw={" some-class  some-other-class "} />`,
      output: `;<div className="some-class some-other-class" />`,
    },
    {
      title: "Combined with className",
      code: `;<div className="some-class" tw="some-other-class" />`,
      output: `;<div className="some-class some-other-class" />`,
    },
    {
      title: "Combined with className string literal expression",
      code: `;<div className={"some-class"} tw="some-other-class" />`,
      output: `;<div className="some-class some-other-class" />`,
    },
    {
      title: "Combined with className variable",
      code: `;<div className={someClass} tw="some-other-class" />`,
      output: `;<div className={[someClass, "some-other-class"].filter(Boolean).join(" ")} />`,
    },
    {
      title: "String expression combined with className variable",
      code: `;<div className={someClass} tw={"some-other-class"} />`,
      output: `;<div className={[someClass, "some-other-class"].filter(Boolean).join(" ")} />`,
    },
  ].map(addImport),
})
