# tw.macro

Convenience macro that allows you to put your Tailwind CSS class names in a
vertical list for easy reading.

```js
const small = tw`
  inline-flex
  items-center
  px-3
  py-2
  border
  border-transparent
`
```

```js
const Small = () => (
  <div
    tw="inline-flex
        items-center
        px-3
        py-2
        border
        border-transparent"
  />
)
```

Inspired and based heavily on
[twin.macro](https://github.com/ben-rogerson/twin.macro/). Some code taken from
there, which is copyright [Ben Rogerson](https://github.com/ben-rogerson)
