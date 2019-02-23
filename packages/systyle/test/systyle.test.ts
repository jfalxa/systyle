import { pickCSS, createElement } from '../src'
import { createSystem, Builder } from 'moulinette'

const id: Builder = v => v

it('creates a styled system', () => {
  const Styled = createSystem(id).with(pickCSS)

  expect(Styled({})).toEqual({})
  expect(Styled({ regular: true })).toEqual({ regular: true })
  expect(Styled({ background: 'red' })).toEqual({ css: { background: 'red' } })
  expect(Styled({ regular: true, background: 'red' })).toEqual({ regular: true, css: { background: 'red' } }) // prettier-ignore
  expect(Styled({ css: { color: 'blue' }, background: 'red' })).toEqual({ css: { color: 'blue', background: 'red' } }) // prettier-ignore
})

it('removes css with void values', () => {
  const Styled = createSystem(id).with(pickCSS)
  const A = Styled.with({ color: 'red' })
  const B = A.with({ color: null })

  expect(Styled({ color: null })).toEqual({})
  expect(A({ color: null })).toEqual({})
  expect(B({})).toEqual({})
})

it('creates variations of a styled system', () => {
  const Styled = createSystem(id).with(createElement, pickCSS)

  const Box = Styled.with({ display: 'flex' })
  const Text = Styled.with({ as: 'span', fontFamily: 'mono', fontSize: 16 })
  const BlueBox = Box.with({ background: 'blue' })
  const Title = Text.with({ as: 'h1', fontSize: 24 })

  expect(Styled({ color: '#fff' })).toEqual({ as: 'div', css: { color: '#fff' } }) // prettier-ignore
  expect(Box({})).toEqual({ as: 'div', css: { display: 'flex' } }) // prettier-ignore
  expect(Text({})).toEqual({ as: 'span', css: { fontFamily: 'mono', fontSize: 16 } }) // prettier-ignore
  expect(BlueBox({})).toEqual({ as: 'div', css: { display: 'flex', background: 'blue' } }) // prettier-ignore
  expect(Title({})).toEqual({ as: 'h1', css: { fontFamily: 'mono', fontSize: 24 } }) // prettier-ignore
})

it('detects nested css rules', () => {
  const Styled = createSystem(id).with(pickCSS)
  const style = { color: 'red' }

  expect(Styled({ ':hover': style })).toEqual({ css: { ':hover': style } })
  expect(Styled({ '@media': style })).toEqual({ css: { '@media': style } })
  expect(Styled({ '.class': style })).toEqual({ css: { '.class': style } })
  expect(Styled({ '#id': style })).toEqual({ css: { '#id': style } })
  expect(Styled({ regular: style })).toEqual({ regular: style })
})
