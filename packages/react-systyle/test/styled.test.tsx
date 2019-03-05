import * as React from 'react'
import * as renderer from 'react-test-renderer'
import serializer from 'jest-emotion'
import { ThemeContext } from '@emotion/core'

import Styled from '../src'

expect.addSnapshotSerializer(serializer)

// give a fixed classname to the component
Styled.className = 'styled'

it('creates an already usable systyle component', () => {
  const styled = renderer.create(<Styled>content</Styled>)
  const element = styled.toJSON()!

  expect(element.type).toBe('div')
  expect(element.props.className).toBe(Styled.toString().slice(1))
  expect(element.children).toEqual(['content'])
})

it('sets styling props', () => {
  const css = {
    id: 'styled',
    bg: 'red',
    px: 2,

    '&:hover': {
      bg: 'lime'
    }
  }

  const styled = renderer.create(<Styled {...css}>content</Styled>)

  expect(styled.toJSON()).toMatchSnapshot()
})

it('uses emotion theme context', () => {
  const theme = {
    colors: {
      test: 'red'
    }
  }

  const App = () => (
    <ThemeContext.Provider value={theme}>
      <Styled bg="test" />
    </ThemeContext.Provider>
  )

  const app = renderer.create(<App />)

  expect(app.toJSON()).toMatchSnapshot()
})
