import { Builder, Props } from 'moulinette/lib/types'
import { createSystem } from 'moulinette'

import { mixin } from '../src'
import { extractCSS } from '../src/moulinettes/css'
import { createElement } from '../src/moulinettes/element'
import { applyTheme } from '../src/moulinettes/theme'
import { aliases } from '../src/moulinettes/aliases'
import { responsive, mediaQuery } from '../src/moulinettes/responsive'
import { StyledSystem } from '../src/types'

type Component = (props: Props) => any
const sys: Builder<Component> = v => v

it('creates a styled system', () => {
  const Styled = createSystem(sys).with(extractCSS)

  expect(Styled({})).toEqual({})
  expect(Styled({ regular: true })).toEqual({ regular: true })
  expect(Styled({ background: 'red' })).toEqual({ css: [{ background: 'red' }] }) // prettier-ignore
  expect(Styled({ regular: true, background: 'red' })).toEqual({ regular: true, css:[ { background: 'red' }] }) // prettier-ignore
  expect(Styled({ css: [{ color: 'blue' }], background: 'red' })).toEqual({ css: [{ background: 'red' }, { color: 'blue' }] }) // prettier-ignore
})

it('passes a css object to a styled system', () => {
  const Styled = createSystem(sys).with(extractCSS)

  expect(Styled({ css: { background: 'red' } })).toEqual({ css: [{ background: 'red' }] }) // prettier-ignore
})

it('removes css with void values', () => {
  const Styled = createSystem(sys).with(extractCSS)
  const A = Styled.with({ color: 'red' })
  const B = A.with({ color: null })

  expect(Styled({ color: null })).toEqual({})
  expect(A({ color: null })).toEqual({})
  expect(B({})).toEqual({})
})

it('creates variations of a styled system', () => {
  const Styled = createSystem(sys).with(createElement, extractCSS)

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
  const Styled = createSystem(sys).with(extractCSS)
  const style = { color: 'red' }

  expect(Styled({ ':hover': style })).toEqual({ css: [{ ':hover': style }] })
  expect(Styled({ '@media': style })).toEqual({ css: [{ '@media': style }] })
  expect(Styled({ '.class': style })).toEqual({ css: [{ '.class': style }] })
  expect(Styled({ '#id': style })).toEqual({ css: [{ '#id': style }] })
  expect(Styled({ regular: style })).toEqual({ regular: style })
})

it('can add css to a system with a template string', () => {
  const Styled = createSystem(sys)
    .extend<Component & StyledSystem>(mixin)
    .with(extractCSS)

  const t = 'color: red;'
  const tt = 'background: blue;'
  const o = { width: '10px' }
  const oo = { height: '20px' }

  const O = Styled.with(o)
  const T = Styled.css`${t}`
  const O_T = O.css`${t}`
  const T_O = T.with(o)
  const T_T = T.css`${tt}`
  const O_O = O.with(oo)
  const T_O_T = T_O.css`${tt}`
  const O_T_O = O_T.with(oo)
  const T_O_O_T = T_O.with(oo).css`${tt}`

  const Weird = Styled.css`${t}`
    .with(o)
    .with(({ test, ...props }) => ({ ...props, background: test })).css`${tt}`

  const Prop = Styled.css`border: ${p => p.myBorder || 'none'};`

  expect(Styled({})).toEqual({})
  expect(Styled(o)).toEqual({ css: [o] })
  expect(O({})).toEqual({ css: [o] })
  expect(T({})).toEqual({ css: [t] })
  expect(O({ css: [t] })).toEqual({ css: [o, t] })
  expect(T({ css: [o] })).toEqual({ css: [t, o] })
  expect(O_T({})).toEqual({ css: [o, t] })
  expect(T_O({})).toEqual({ css: [t, o] })
  expect(T_T({})).toEqual({ css: [t, tt] })
  expect(O_O({})).toEqual({ css: [{ ...o, ...oo }] })
  expect(T_O_T({})).toEqual({ css: [t, o, tt] })
  expect(O_T_O({})).toEqual({ css: [o, t, oo] })
  expect(T_O_O_T({})).toEqual({ css: [t, { ...o, ...oo }, tt] })
  expect(Weird({ test: 'red' })).toEqual({ css: [t, { ...o, background: 'red'}, tt]}) // prettier-ignore
  expect(Prop({})).toEqual({ css: ['border: none;'] })
  expect(Prop({ myBorder: '1px solid black' })).toEqual({ myBorder: '1px solid black', css: ['border: 1px solid black;'] }) // prettier-ignore
})

it('uses theme config', () => {
  const theme = {
    spacing: 8,
    fonts: { custom: 'my-font' },
    sizes: { M: '16px' },
    colors: { main: 'red' }
  }

  const injectTheme: Builder<Component> = moulinette => input => {
    const { theme: _ = null, ...props } = moulinette({ ...input, theme }) || {}
    return props
  }

  const Styled = createSystem(injectTheme).with(applyTheme)

  expect(Styled({ marginTop: 1 })).toEqual({ marginTop: 8 })
  expect(Styled({ fontFamily: 'custom' })).toEqual({ fontFamily: 'my-font' })
  expect(Styled({ fontSize: 'M' })).toEqual({ fontSize: '16px' })
  expect(Styled({ color: 'main' })).toEqual({ color: 'red' })
  expect(Styled({ ':hover': { color: 'main' } })).toEqual({ ':hover': { color: 'red' } }) // prettier-ignore
})

it('renames some props', () => {
  const Styled = createSystem(sys).with(aliases)

  expect(Styled({ bg: 'red' })).toEqual({ backgroundColor: 'red' })
  expect(Styled({ mt: 1 })).toEqual({ marginTop: 1 })
  expect(Styled({ size: 'big' })).toEqual({ fontSize: 'big' })
  expect(Styled({ b: 'none' })).toEqual({ border: 'none' })
  expect(Styled({ px: 2 })).toEqual({ paddingLeft: 2, paddingRight: 2 })
})

it('deals with responsive props', () => {
  const bps = {
    mobile: 0,
    tablet: 600,
    desktop: 1000
  }

  const theme = {
    breakpoints: bps
  }

  const Styled = createSystem(sys).with(
    ({ theme, ...props }) => props,
    responsive,
    { theme }
  )

  expect(createSystem(sys).with(responsive)({})).toEqual({})

  expect(Styled({ mobile: { bg: 'red' } })).toEqual({
    [mediaQuery('0')]: { bg: 'red' }
  })

  expect(
    Styled({
      mobile: { a: 'red', b: 'green' },
      tablet: { a: 'yellow' },
      desktop: { b: 'cyan' }
    })
  ).toEqual({
    [mediaQuery('0')]: { a: 'red', b: 'green' },
    [mediaQuery('600')]: { a: 'yellow' },
    [mediaQuery('1000')]: { b: 'cyan' }
  })
})
