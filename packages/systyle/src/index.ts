import { Builder } from 'moulinette/lib/types'
import { createSystem, compose } from 'moulinette'

import { StyledSystem } from './types'
import { compileCSS } from './moulinettes/css'
import { addTemplate } from './moulinettes/template'
import { createElement } from './moulinettes/element'
import { addAnimation, combineAnimations } from './moulinettes/animations'

export const systyle = compose([createElement, compileCSS, combineAnimations])

export function mixin(Styled: StyledSystem) {
  Styled.as = type => Styled.with({ as: type })

  Styled.css = (strings, ...args) => Styled.with(addTemplate(strings, args))

  Styled.animate = (duration, animation = '') =>
    Styled.with(addAnimation(`${animation} ${duration}`))
}

export function createStyled<T>(builder: Builder<T>) {
  return createSystem(builder).extend<T & StyledSystem>(mixin)
}

export default createSystem
