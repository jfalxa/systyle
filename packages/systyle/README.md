# Systyle

A set of `moulinette` helpers to style components through their props.

## Example: creating a styled system for hyperapp

```js
import { h } from "hyperapp"
import { createStyled } from 'systyle'
import { cx, css as emotion } from 'emotion'

const hyperappBuilder = moulinette =>
  function Styled(props, children) {
    const {
      as: type, = 'div',
      css = [],
      className = '',
      ...props
    } = moulinette(props)

    return h(type, { ...props, className: cx(className, emotion(css)) }, children) />
  }

const Styled = createStyled(hyperappBuilder)

const App = props => (
  <Styled as="main" display="flex" flexDirection="column">
    <Styled as="h1">Hi</Styled>
    <Styled as="span">Some text</Styled>
  </Styled>
)
```

## Using a styled component

[See react-systyle documentation](../react-systyle)
