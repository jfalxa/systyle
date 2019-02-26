import { Props } from 'moulinette/lib/types'
import { compile } from 'moulinette'

import { Theme, By } from '../types'
import { isCSS, replace } from '../helpers'

function theme(props: Props, category: keyof Theme, key?: string) {
  if (!('theme' in props) || !(category in props.theme)) return key

  const values = props.theme[category]

  if (typeof key !== 'undefined') {
    return key in values ? values[key] : key
  } else {
    return values
  }
}

const rxSpacing = /margin|padding/
const rxColor = /color|Color/

const replaceCSS = (parser: By) => {
  return replace((value, key, props) =>
    isCSS(value, key) ? parser(value, key, props) : undefined
  )
}

export const spacing = replaceCSS((value, key, props) => {
  if (typeof value === 'number' && rxSpacing.test(key)) {
    return value * (theme(props, 'spacing') || 1)
  }
})

export const fonts = replaceCSS((value, key, props) => {
  if (key === 'fontFamily') {
    return theme(props, 'fonts', value)
  }
})

export const sizes = replaceCSS((value, key, props) => {
  if (key === 'fontSize') {
    return theme(props, 'sizes', value)
  }
})

export const colors = replaceCSS((value, key, props) => {
  if (key === 'background' || rxColor.test(key)) {
    return theme(props, 'colors', value)
  }
})

export const applyTheme = compile([spacing, fonts, sizes, colors])
