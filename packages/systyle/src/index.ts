import { Builder } from 'moulinette/lib/types'
import { createSystem, compose } from 'moulinette'

import { Styled } from './types'
import { compileCSS } from './moulinettes/css'
import { addTemplate } from './moulinettes/template'
import { createElement } from './moulinettes/element'
import { addAnimation, combineAnimations } from './moulinettes/animations'

export const systyle = compose([createElement, compileCSS, combineAnimations])

export function extension(Styled: Styled) {
  Styled.as = type => Styled.with({ as: type })

  Styled.css = (strings, ...args) => Styled.with(addTemplate(strings, args))

  Styled.animate = (duration, animation = '') =>
    Styled.with(addAnimation(`${animation} ${duration}`))
}

export function createStyled(builder: Builder): Styled {
  return createSystem(builder).extend(extension)
}

export default createStyled
