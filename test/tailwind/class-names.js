const { getClassNames } = require("../../lib/tailwind/class-names")
const assert = require("assert").strict

const test = it

context("Tailwind", () => {
  context("Class Names", () => {
    context("Get", async () => {
      test("Includes default classes", async () => {
        const classNames = await getClassNames()

        assert(classNames.includes("mt-1"))
      })
    })
  })
})
