import createStyled from '../src'
import { extractCSS } from '../src/moulinettes/css'
import { applyTheme } from '../src/moulinettes/theme'
import { aliases } from '../src/moulinettes/aliases'
import { responsive, mediaQuery } from '../src/moulinettes/responsive'
import { Builder, Props } from '../src/types'

type Component = (props: Props) => any
const sys: Builder<Component> = v => v

it('creates a styled system', () => {
  expect(extractCSS({})).toEqual({})
  expect(extractCSS({ regular: true })).toEqual({ regular: true })
  expect(extractCSS({ background: 'red' })).toEqual({ css: [{ background: 'red' }] }) // prettier-ignore
  expect(extractCSS({ regular: true, background: 'red' })).toEqual({ regular: true, css:[ { background: 'red' }] }) // prettier-ignore
  expect(extractCSS({ css: [{ color: 'blue' }], background: 'red' })).toEqual({ css: [{ background: 'red' }, { color: 'blue' }] }) // prettier-ignore
})

it('passes a css object to a styled system', () => {
  expect(extractCSS({ css: { background: 'red' } })).toEqual({ css: [{ background: 'red' }] }) // prettier-ignore
})

it('removes css with void values', () => {
  expect(extractCSS({ color: null })).toEqual({})
})

it('creates variations of a styled system', () => {
  const Styled = createStyled(sys)

  const Box = Styled.with({ display: 'flex' })
  const Text = Styled.with({ as: 'span', fontFamily: 'mono', fontSize: 16 })
  const BlueBox = Box.with({ background: 'blue' })
  const Title = Text.with({ as: 'h1', fontSize: 24 })

  expect(Styled({ color: '#fff' })).toEqual({ as: 'div', className: Styled.className, css: [{ color: '#fff' }] }) // prettier-ignore
  expect(Box({})).toEqual({ as: 'div', className: Box.className,  css: [{ display: 'flex' }] }) // prettier-ignore
  expect(Text({})).toEqual({ as: 'span', className: Text.className, css: [{ fontFamily: 'mono', fontSize: 16 }] }) // prettier-ignore
  expect(BlueBox({})).toEqual({ as: 'div', className: BlueBox.className, css: [{ display: 'flex', background: 'blue' }] }) // prettier-ignore
  expect(Title({})).toEqual({ as: 'h1', className: Title.className, css: [{ fontFamily: 'mono', fontSize: 24 }] }) // prettier-ignore
})

it('detects nested css rules', () => {
  const style = { color: 'red' }

  expect(extractCSS({ ':hover': style })).toEqual({ css: [{ ':hover': style }] }) // prettier-ignore
  expect(extractCSS({ '@media': style })).toEqual({ css: [{ '@media': style }] }) // prettier-ignore
  expect(extractCSS({ '.class': style })).toEqual({ css: [{ '.class': style }] }) // prettier-ignore
  expect(extractCSS({ '#id': style })).toEqual({ css: [{ '#id': style }] }) // prettier-ignore
  expect(extractCSS({ regular: style })).toEqual({ regular: style })
})

it('uses theme config', () => {
  const theme = {
    spacing: 8,
    fonts: { custom: 'my-font' },
    sizes: { M: '16px' },
    colors: { main: 'red' }
  }

  expect(applyTheme({ theme, marginTop: 1 })).toEqual({ theme, marginTop: 8 })
  expect(applyTheme({ theme, fontFamily: 'custom' })).toEqual({ theme, fontFamily: 'my-font' }) // prettier-ignore
  expect(applyTheme({ theme, fontSize: 'M' })).toEqual({ theme, fontSize: '16px' }) // prettier-ignore
  expect(applyTheme({ theme, color: 'main' })).toEqual({ theme, color: 'red' })
  expect(applyTheme({ theme, ':hover': { color: 'main' } })).toEqual({ theme, ':hover': { color: 'red' } }) // prettier-ignore
})

it('renames some props', () => {
  expect(aliases({ bg: 'red' })).toEqual({ backgroundColor: 'red' })
  expect(aliases({ mt: 1 })).toEqual({ marginTop: 1 })
  expect(aliases({ size: 'big' })).toEqual({ fontSize: 'big' })
  expect(aliases({ b: 'none' })).toEqual({ border: 'none' })
  expect(aliases({ px: 2 })).toEqual({ paddingLeft: 2, paddingRight: 2 })
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

  const resp = (props: Props) => {
    const { theme: _, ...result } = responsive({ theme, ...props })
    return result
  }

  expect(resp({ mobile: { bg: 'red' } })).toEqual({
    [mediaQuery('0')]: { bg: 'red' }
  })

  expect(
    resp({
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
