import { Builder } from 'moulinette/lib/types'
import { createSystem } from 'moulinette'

import { Styled } from './types'
import { compileCSS } from './moulinettes/css'
import { addTemplate } from './moulinettes/template'
import { createElement } from './moulinettes/element'
import { addAnimation, combineAnimations } from './moulinettes/animations'

export function extension(Styled: Styled) {
  Styled.as = type => Styled.with({ as: type })

  Styled.css = (strings, ...args) => Styled.with(addTemplate(strings, args))

  Styled.animate = (duration, animation = '') =>
    Styled.with(addAnimation(`${animation} ${duration}`))
}

export function createStyled(builder: Builder): Styled {
  return createSystem(builder)
    .extend(extension)
    .with(createElement, compileCSS, combineAnimations)
}

export default createStyled
