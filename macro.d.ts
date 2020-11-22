import "react"

declare const tw: (
  strings: Readonly<TemplateStringsArray>,
  ...values: readonly string[]
) => string

export default tw

declare module 'react' {
  interface DOMAttributes<T> {
    tw?: string
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string
    }
  }
}
