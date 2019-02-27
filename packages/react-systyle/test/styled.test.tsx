import * as React from 'react'
import * as renderer from 'react-test-renderer'
import serializer from 'jest-emotion'

import Styled from '../src'

expect.addSnapshotSerializer(serializer)

it('creates an already usable systyle component', () => {
  const styled = renderer.create(<Styled>content</Styled>)
  const element = styled.toJSON()!

  expect(element.type).toBe('div')
  expect(element.props.className).toBe(Styled.toString().slice(1))
  expect(element.children).toEqual(['content'])
})

it('sets styling props', () => {
  const style = {
    id: 'styled',
    bg: 'red',
    px: 2,

    '&:hover': {
      bg: 'lime'
    }
  }

  const styled = renderer.create(<Styled {...style}>content</Styled>)

  expect(styled.toJSON()).toMatchSnapshot()
})
