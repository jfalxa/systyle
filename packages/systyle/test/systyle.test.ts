import { createSystem, Builder, Props } from 'moulinette'
import { groupCSS, createElement, extension, generateCSS } from '../src'

const id: Builder = v => v

it('creates a styled system', () => {
  const Styled = createSystem(id).with(groupCSS)

  expect(Styled({})).toEqual({})
  expect(Styled({ regular: true })).toEqual({ regular: true })
  expect(Styled({ background: 'red' })).toEqual({ css: [{ background: 'red' }] }) // prettier-ignore
  expect(Styled({ regular: true, background: 'red' })).toEqual({ regular: true, css:[ { background: 'red' }] }) // prettier-ignore
  expect(Styled({ css: [{ color: 'blue' }], background: 'red' })).toEqual({ css: [{ background: 'red' }, { color: 'blue' }] }) // prettier-ignore
})

it('removes css with void values', () => {
  const Styled = createSystem(id).with(groupCSS)
  const A = Styled.with({ color: 'red' })
  const B = A.with({ color: null })

  expect(Styled({ color: null })).toEqual({})
  expect(A({ color: null })).toEqual({})
  expect(B({})).toEqual({})
})

it('creates variations of a styled system', () => {
  const Styled = createSystem(id).with(createElement, groupCSS)

  const Box = Styled.with({ display: 'flex' })
  const Text = Styled.with({ as: 'span', fontFamily: 'mono', fontSize: 16 })
  const BlueBox = Box.with({ background: 'blue' })
  const Title = Text.with({ as: 'h1', fontSize: 24 })

  expect(Styled({ color: '#fff' })).toEqual({ as: 'div', css: [{ color: '#fff' }] }) // prettier-ignore
  expect(Box({})).toEqual({ as: 'div', css: [{ display: 'flex' }] }) // prettier-ignore
  expect(Text({})).toEqual({ as: 'span', css: [{ fontFamily: 'mono', fontSize: 16 }] }) // prettier-ignore
  expect(BlueBox({})).toEqual({ as: 'div', css: [{ display: 'flex', background: 'blue' }] }) // prettier-ignore
  expect(Title({})).toEqual({ as: 'h1', css: [{ fontFamily: 'mono', fontSize: 24 }] }) // prettier-ignore
})

it('detects nested css rules', () => {
  const Styled = createSystem(id).with(groupCSS)
  const style = { color: 'red' }

  expect(Styled({ ':hover': style })).toEqual({ css: [{ ':hover': style }] })
  expect(Styled({ '@media': style })).toEqual({ css: [{ '@media': style }] })
  expect(Styled({ '.class': style })).toEqual({ css: [{ '.class': style }] })
  expect(Styled({ '#id': style })).toEqual({ css: [{ '#id': style }] })
  expect(Styled({ regular: style })).toEqual({ regular: style })
})

it('can add css to a system with a template string', () => {
  const Styled = createSystem(id).extend(extension)

  const getter = (props: Props) => props.color

  const A = Styled.css`display: flex;`
  const B = A.css`color: ${getter};`
  const C = B.css`background: blue;`
  const D = A.with({ color: 'red' }, { background: 'yellow' }).css`border: none;` // prettier-ignore

  const display = [['display: flex;'], []]
  const color = [['color: ', ';'], [getter]]
  const background = [['background: blue;'], []]
  const border = [['border: none;'], []]

  expect(Styled({})).toEqual({})
  expect(A({})).toEqual({ css: [display] })
  expect(B({})).toEqual({ css: [display, color] })
  expect(C({})).toEqual({ css: [display, color, background] })
  expect(D({})).toEqual({ css: [display, { color: 'red', background: 'yellow' }, border] }) // prettier-ignore
})

it('generates css respecting the order in which it was defined', () => {
  const Styled = createSystem(id)
    .with(generateCSS, groupCSS)
    .extend(extension).css`
      display: flex;
    `
    .with({ color: 'red' })
    .with({ cursor: 'pointer' })
    .with({ background: 'yellow' }).css`
      border: none; 
      background: purple;
    `

  expect(Styled({}).classList).toHaveLength(3)
})
