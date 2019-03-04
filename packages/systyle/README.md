# Systyle

A set of `moulinette` helpers to style components through their props.

## Creating a styled system for react

```JS
import React from 'react'
import { createStyled, systyle } from 'systyle'
import { cx, css as emotion } from 'emotion'

const reactBuilder = moulinette =>
  function Styled(props) {
    const {
      as: Type = 'div',
      css = [],
      className = '',
      ...props
    } = moulinette(props)

    return <Type className={cx(className, emotion(css))} />
  }

const Styled = createStyled(reactBuilder).with(systyle)

const App = props => (
  <Styled as="main" display="flex" flexDirection="column">
    <Styled as="h1">Hi</Styled>
    <Styled as="span">Some text</Styled>
  </Styled>
)
```

## Using a styled component

[See react-systyle documentation](../react-systyle)
