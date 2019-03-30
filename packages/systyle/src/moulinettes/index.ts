import { compose } from '../moulinette'
import { createElement } from './element'
import { extractCSS } from './css'
import { applyTheme } from './theme'
import { aliases } from './aliases'
import { responsive } from './responsive'

export const systyle = compose([
  createElement,
  extractCSS,
  applyTheme,
  responsive,
  aliases
])
